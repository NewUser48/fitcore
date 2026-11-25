import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const body = await req.json();
    const sessionDate = String(body.session_date || "").trim();
    const startTime = String(body.start_time || "").trim();
    const endTime = String(body.end_time || "").trim();
    const focusArea = String(body.focus_area || "1-on-1 Personal Training").trim();
    const notes = body.notes ? String(body.notes).trim() : "";

    if (!DATE_RE.test(sessionDate)) {
      return NextResponse.json({ error: "Please choose a valid date." }, { status: 400 });
    }
    if (!TIME_RE.test(startTime) || !TIME_RE.test(endTime)) {
      return NextResponse.json({ error: "Please choose valid start and end times." }, { status: 400 });
    }
    if (endTime <= startTime) {
      return NextResponse.json(
        { error: "End time must be after start time." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    // Confirm the caller is enrolled as a member.
    const { data: memberRow, error: memberError } = await adminClient
      .from("members")
      .select("id, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }
    if (!memberRow) {
      return NextResponse.json(
        { error: "No athlete profile found for this account." },
        { status: 403 }
      );
    }

    // Attach the session to the trainer (single-trainer setup).
    const { data: trainer } = await adminClient
      .from("profiles")
      .select("id")
      .eq("role", "trainer")
      .limit(1)
      .maybeSingle();

    // Prevent exact duplicate requests for the same slot.
    const { data: existing } = await adminClient
      .from("training_sessions")
      .select("id")
      .eq("member_id", user.id)
      .eq("session_date", sessionDate)
      .eq("start_time", startTime)
      .neq("status", "Cancelled")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You already have a session request for that time." },
        { status: 409 }
      );
    }

    const { data: inserted, error: insertError } = await adminClient
      .from("training_sessions")
      .insert({
        member_id: user.id,
        trainer_id: trainer?.id ?? null,
        session_date: sessionDate,
        start_time: startTime,
        end_time: endTime,
        focus_area: focusArea,
        status: "Scheduled",
        notes: notes
          ? `${notes} — Requested by member via Athlete Portal`
          : "Requested by member via Athlete Portal",
      })
      .select("id, session_date, start_time, end_time, focus_area, status, notes")
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Could not book session: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, session: inserted });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
