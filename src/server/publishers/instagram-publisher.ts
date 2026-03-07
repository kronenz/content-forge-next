import type { PlatformPublisher, PublishRequest, PublishResult } from "./types";

export class InstagramPublisher implements PlatformPublisher {
  async publish(request: PublishRequest): Promise<PublishResult> {
    // TODO: Implement Instagram Graph API integration
    // Requires: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID env vars
    // API: POST https://graph.facebook.com/v18.0/{ig-user-id}/media

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken) {
      return {
        success: false,
        error: "Instagram access token not configured",
      };
    }

    // Instagram requires at least one image
    if (!request.media || request.media.length === 0) {
      return {
        success: false,
        error: "Instagram requires at least one image",
      };
    }

    // Validate caption length
    if (request.body.length > 2200) {
      return {
        success: false,
        error: `Caption exceeds Instagram 2,200 character limit (${request.body.length} chars)`,
      };
    }

    // Mock response
    const postId = `${Date.now()}`;
    return {
      success: true,
      publishedUrl: `https://www.instagram.com/p/${postId}`,
      platformPostId: postId,
    };
  }
}
