import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

// Email capture, backed by a real Supabase table (subscribers: email,
// subscribed_at) instead of a local JSON file — file storage doesn't
// survive between deploys on serverless hosts like Vercel. No outgoing
// emails are sent automatically; check the table in Supabase and email
// people manually (or wire up a real provider like Resend later).
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("subscribers")
    .upsert({ email: email.toLowerCase() }, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    console.error("subscribe insert failed:", error.message);
    return NextResponse.json({ error: "Could not save email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
