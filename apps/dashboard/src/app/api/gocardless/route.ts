import { updateBankConnection } from "@solomon/supabase/mutations";
import { createClient } from "@solomon/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const preferredRegion = ["fra1", "sfo1", "iad1"];

export async function GET(req) {
  const supabase = createClient();
  const requestUrl = new URL(req.url);
  const id = requestUrl.searchParams.get("id");
  const isDesktop = requestUrl.searchParams.get("desktop");

  if (id) {
    await updateBankConnection(supabase, id);
  }

  if (isDesktop === "true") {
    return NextResponse.redirect("solomonai://");
  }

  return NextResponse.redirect(requestUrl.origin);
}
