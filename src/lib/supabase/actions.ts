"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidates Next.js static and dynamic portfolio pages immediately upon editorial updates.
 */
export async function revalidatePortfolio(slug?: string) {
  try {
    revalidatePath("/");
    revalidatePath("/work");
    if (slug) {
      revalidatePath(`/work/${slug}`);
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Revalidation error:", message);
    return { success: false, error: message };
  }
}
