import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

/**
 * Route handler to disable Next.js Draft Mode and return to standard cached rendering.
 *
 * Usage:
 *   GET /api/draft-mode/disable?redirect=/work
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const redirectPath = searchParams.get("redirect") || "/work";

  // Disable Next.js Draft Mode (clears bypass cookie)
  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(new URL(redirectPath, req.url));
}
