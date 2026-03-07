#!/usr/bin/env bash
set -euo pipefail

# Content Forge - GitHub Actions Self-Hosted Runner Setup
# Run this script to install and configure a self-hosted runner on your local server.
#
# Prerequisites:
#   - Docker installed and running
#   - gh CLI authenticated (gh auth status)
#
# Usage:
#   ./scripts/setup-runner.sh              # Interactive setup
#   ./scripts/setup-runner.sh --token PAT  # With personal access token

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

REPO="kronenz/content-forge-next"
RUNNER_DIR="$HOME/actions-runner"
RUNNER_NAME="content-forge-local"
RUNNER_LABELS="self-hosted,linux,x64,on-prem"

echo -e "${BOLD}${CYAN}GitHub Actions Self-Hosted Runner Setup${NC}"
echo -e "${CYAN}Repository: ${REPO}${NC}\n"

# Check prerequisites
check_prereqs() {
  local missing=0

  if ! command -v docker &>/dev/null; then
    echo -e "${RED}Docker not found. Please install Docker first.${NC}"
    missing=1
  fi

  if ! command -v gh &>/dev/null; then
    echo -e "${RED}gh CLI not found. Please install gh first.${NC}"
    missing=1
  else
    if ! gh auth status &>/dev/null; then
      echo -e "${RED}gh CLI not authenticated. Run 'gh auth login' first.${NC}"
      missing=1
    fi
  fi

  if [[ $missing -eq 1 ]]; then
    exit 1
  fi
  echo -e "${GREEN}Prerequisites OK.${NC}"
}

# Get runner registration token via gh API
get_registration_token() {
  echo -e "${CYAN}Getting runner registration token...${NC}"
  RUNNER_TOKEN=$(gh api "repos/${REPO}/actions/runners/registration-token" --method POST --jq '.token' 2>/dev/null)
  if [[ -z "$RUNNER_TOKEN" ]]; then
    echo -e "${RED}Failed to get registration token. Make sure you have admin access to the repo.${NC}"
    exit 1
  fi
  echo -e "${GREEN}Token obtained.${NC}"
}

# Download and install runner
install_runner() {
  if [[ -d "$RUNNER_DIR" ]]; then
    echo -e "${YELLOW}Runner directory already exists at ${RUNNER_DIR}${NC}"
    echo -e "${YELLOW}If you want to reinstall, remove it first: rm -rf ${RUNNER_DIR}${NC}"

    # Check if already configured
    if [[ -f "$RUNNER_DIR/.runner" ]]; then
      echo -e "${GREEN}Runner already configured. Skipping install.${NC}"
      return 0
    fi
  fi

  mkdir -p "$RUNNER_DIR"
  cd "$RUNNER_DIR"

  # Get latest runner version
  local RUNNER_VERSION
  RUNNER_VERSION=$(gh api repos/actions/runner/releases/latest --jq '.tag_name' | sed 's/^v//')
  local RUNNER_ARCH="linux-x64"
  local RUNNER_URL="https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-${RUNNER_ARCH}-${RUNNER_VERSION}.tar.gz"

  echo -e "${CYAN}Downloading runner v${RUNNER_VERSION}...${NC}"
  curl -sL "$RUNNER_URL" | tar xz

  echo -e "${CYAN}Configuring runner...${NC}"
  ./config.sh \
    --url "https://github.com/${REPO}" \
    --token "$RUNNER_TOKEN" \
    --name "$RUNNER_NAME" \
    --labels "$RUNNER_LABELS" \
    --work "_work" \
    --unattended \
    --replace

  echo -e "${GREEN}Runner configured at ${RUNNER_DIR}${NC}"
}

# Install as systemd service
install_service() {
  cd "$RUNNER_DIR"

  echo -e "${CYAN}Installing runner as systemd service...${NC}"

  # Create systemd service file
  local SERVICE_FILE="$HOME/.config/systemd/user/actions-runner.service"
  mkdir -p "$(dirname "$SERVICE_FILE")"

  cat > "$SERVICE_FILE" <<SERVICEEOF
[Unit]
Description=GitHub Actions Runner (content-forge)
After=network.target docker.service

[Service]
Type=simple
WorkingDirectory=${RUNNER_DIR}
ExecStart=${RUNNER_DIR}/run.sh
Restart=always
RestartSec=10
Environment=RUNNER_ALLOW_RUNASROOT=1

[Install]
WantedBy=default.target
SERVICEEOF

  systemctl --user daemon-reload
  systemctl --user enable actions-runner.service
  systemctl --user start actions-runner.service

  # Enable lingering so service runs without login
  loginctl enable-linger "$(whoami)" 2>/dev/null || true

  echo -e "${GREEN}Runner service installed and started.${NC}"
  echo -e "${CYAN}Manage with:${NC}"
  echo -e "  systemctl --user status actions-runner"
  echo -e "  systemctl --user stop actions-runner"
  echo -e "  systemctl --user restart actions-runner"
  echo -e "  journalctl --user -u actions-runner -f"
}

# Main
check_prereqs
get_registration_token
install_runner
install_service

echo -e "\n${GREEN}${BOLD}Self-hosted runner setup complete!${NC}"
echo -e "${CYAN}Runner '${RUNNER_NAME}' is now registered and running.${NC}"
echo -e "${CYAN}It will pick up jobs with 'runs-on: [self-hosted, linux]'${NC}\n"
echo -e "${YELLOW}Next step: Update .github/workflows/ci.yml to use self-hosted runner.${NC}"
