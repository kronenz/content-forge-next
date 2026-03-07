import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { AIChat } from "@/components/ai-chat/ai-chat";
import { InsightPanelWrapper } from "@/components/insight-panel/insight-panel-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
      <CommandPalette />
      <AIChat />
      <InsightPanelWrapper />
    </SidebarProvider>
  );
}
