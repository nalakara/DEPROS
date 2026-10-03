import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

interface WebhookPayload {
  _type?: string;
  slug?: {
    current?: string;
  };
}

/**
 * On-Demand ISR Revalidation Webhook Handler
 *
 * Receives HTTPS POST webhook notifications from Sanity Content Lake when documents
 * are created, updated, or deleted. Triggers targeted cache invalidation without
 * requiring a full site redeployment.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;

    // Parse and authenticate webhook payload
    let body: WebhookPayload | null = null;
    let isValidSignature = false;

    if (secret) {
      const parsed = await parseBody<WebhookPayload>(req, secret);
      body = parsed.body;
      isValidSignature = Boolean(parsed.isValidSignature);

      // Also allow direct header authorization fallback for test suites or simple curl triggers
      const headerSecret = req.headers.get("x-revalidate-secret");
      if (!isValidSignature && headerSecret === secret) {
        isValidSignature = true;
        if (!body) {
          try {
            body = await req.json();
          } catch {
            body = {};
          }
        }
      }

      if (!isValidSignature) {
        return NextResponse.json(
          { message: "Invalid webhook secret or signature." },
          { status: 401 }
        );
      }
    } else {
      // In development / unconfigured secret mode, parse body directly
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    const docType = body?._type;
    const slug = body?.slug?.current;

    // Invalidate general portfolio collection tag and paths
    revalidateTag("portfolio");
    revalidatePath("/", "page");
    revalidatePath("/work", "page");

    // Invalidate client tag if client document was modified
    if (docType === "client") {
      revalidateTag("clients");
    }

    // Invalidate specific project detail page if slug is provided
    if (slug) {
      revalidateTag(`portfolio:${slug}`);
      revalidatePath(`/work/${slug}`, "page");
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      docType: docType || "unknown",
      slug: slug || null,
    });
  } catch (error) {
    console.error("[Revalidation Webhook Error]", error);
    return NextResponse.json(
      { message: "Error executing on-demand revalidation.", error: String(error) },
      { status: 500 }
    );
  }
}
