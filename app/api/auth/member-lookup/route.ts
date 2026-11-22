import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeIndianPhoneNumber } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    const norm = normalizeIndianPhoneNumber(phone);
    if (!norm.isValid) {
      return NextResponse.json({ error: "Invalid mobile number." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    // Lookup member in PostgreSQL by phone
    const { data: member, error } = await adminClient
      .from("members")
      .select("email, full_name")
      .or(`phone.eq.${norm.e164},phone.eq.${norm.e164.replace("+", "")}`)
      .limit(1)
      .maybeSingle();

    if (error || !member || !member.email) {
      return NextResponse.json({ error: "No athlete account found for this mobile number." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      email: member.email,
      fullName: member.full_name,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
