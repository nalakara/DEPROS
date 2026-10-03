import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

/**
 * Route handler to enable Next.js Draft Mode for live editorial preview.
 *
 * Usage:
 *   GET /api/draft-mode/enable?secret=<SANITY_PREVIEW_SECRET>&slug=<project-slug>
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const redirectPath = searchParams.get("redirect") || (slug ? `/work/${slug}` : "/work");

  const expectedSecret =
    process.env.SANITY_PREVIEW_SECRET || process.env.SANITY_REVALIDATE_SECRET;

  // Validate preview secret if configured in environment
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { message: "Invalid preview secret token." },
      { status: 401 }
    );
  }

  // Enable Next.js Draft Mode (sets bypass cookie)
  const draft = await draftMode();
  draft.enable();

  // Redirect to requested editorial preview page
  return NextResponse.redirect(new URL(redirectPath, req.url));
}
