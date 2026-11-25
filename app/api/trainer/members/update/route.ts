import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeIndianPhoneNumber } from "@/lib/auth-helpers";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const STATUS_MAP: Record<string, string> = {
  active: "Active",
  expiring: "Expiring",
  expired: "Expired",
  inactive: "Inactive",
  pending: "Inactive",
};

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Member id is required." }, { status: 400 });
    }

    // Demo/seeded member ids are not UUIDs - no DB row to update.
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ success: true, mock: true });
    }

    if (!body.full_name || !String(body.full_name).trim()) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    const phone = normalizeIndianPhoneNumber(body.phone ?? "");
    if (!phone.isValid) {
      return NextResponse.json(
        { error: phone.error || "Invalid phone number." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json({ success: true, mock: true });
    }

    const status =
      STATUS_MAP[String(body.membership_status ?? "").toLowerCase()] ?? "Active";

    const emergencyContact =
      body.emergency_contact_name || body.emergency_contact_phone
        ? `${body.emergency_contact_name || ""}${
            body.emergency_contact_phone
              ? ` (${body.emergency_contact_phone})`
              : ""
          }`.trim()
        : null;

    const { error: updateError } = await adminClient
      .from("members")
      .update({
        full_name: String(body.full_name).trim(),
        phone: phone.e164,
        email: body.email || null,
        date_of_birth: body.date_of_birth || null,
        gender: body.gender || null,
        address: body.address || null,
        emergency_contact: emergencyContact,
        height_cm: toNumber(body.height_cm),
        weight_kg: toNumber(body.weight_kg),
        target_weight_kg: toNumber(body.target_weight_kg),
        fitness_goal: body.fitness_goal,
        experience_level: body.experience_level,
        medical_notes: body.medical_notes || null,
        trainer_notes: body.trainer_notes || null,
        membership_plan: body.membership_plan,
        membership_fee: toNumber(body.membership_fee),
        membership_status: status,
        start_date: body.start_date,
        end_date: body.end_date,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: `Database error: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Keep the profile record (used for global directory lookups) in sync.
    await adminClient
      .from("profiles")
      .update({
        full_name: String(body.full_name).trim(),
        phone: phone.e164,
        email: body.email || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      member: { id, full_name: body.full_name, phone: phone.e164 },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
