import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeIndianPhone, isValidIndianPhone } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      full_name,
      phone,
      email,
      date_of_birth,
      gender,
      address,
      emergency_contact,
      height_cm,
      weight_kg,
      target_weight_kg,
      fitness_goal,
      experience_level,
      medical_notes,
      membership_plan,
      membership_fee,
      payment_status,
      start_date,
      end_date,
      temporary_password,
    } = body;

    if (!full_name || !phone || !temporary_password) {
      return NextResponse.json(
        { error: "Full name, phone number, and temporary password are required." },
        { status: 400 }
      );
    }

    if (!isValidIndianPhone(phone)) {
      return NextResponse.json(
        { error: "Invalid Indian mobile number. Must be 10 digits starting with 6, 7, 8, or 9." },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeIndianPhone(phone);
    const adminClient = createAdminClient();

    // If Supabase is not configured yet (local mock mode fallback)
    if (!adminClient) {
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Member created locally (Supabase keys not yet configured in .env.local).",
        member: {
          id: `mem_${Date.now()}`,
          full_name,
          phone: normalizedPhone,
          membership_plan,
        },
      });
    }

    // 1. Create Supabase Auth account using Admin API
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      phone: normalizedPhone,
      password: temporary_password,
      phone_confirm: true, // Confirm phone for login
      user_metadata: {
        role: "member",
        full_name,
        phone: normalizedPhone,
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to create member auth credentials." },
        { status: 400 }
      );
    }

    const memberId = authData.user.id;

    // 2. Insert member record into public.members
    const { error: profileError } = await adminClient.from("members").insert({
      id: memberId,
      full_name,
      phone: normalizedPhone,
      email: email || null,
      date_of_birth: date_of_birth || null,
      gender: gender || null,
      address: address || null,
      emergency_contact: emergency_contact || null,
      height_cm: height_cm ? Number(height_cm) : null,
      weight_kg: weight_kg ? Number(weight_kg) : null,
      target_weight_kg: target_weight_kg ? Number(target_weight_kg) : null,
      fitness_goal: fitness_goal || "Muscle Hypertrophy & Strength",
      experience_level: experience_level || "Intermediate",
      medical_notes: medical_notes || null,
      membership_plan: membership_plan || "Quarterly Elite VIP",
      membership_fee: membership_fee ? Number(membership_fee) : 9500,
      membership_status: "Active",
      start_date: start_date || new Date().toISOString().split("T")[0],
      end_date: end_date || new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
      must_change_password: true,
    });

    if (profileError) {
      // Rollback auth user if profile insertion failed
      await adminClient.auth.admin.deleteUser(memberId);
      return NextResponse.json(
        { error: `Database error: ${profileError.message}` },
        { status: 500 }
      );
    }

    // 3. Seed default 7-Day Workout Note Split
    const defaultDays = [
      { day: "Monday", name: "Chest & Triceps Hypertrophy", rest: false, note: "• Incline Bench: 4x8-10\n• Flat DB Press: 3x10-12\n• Cable Flyes: 3x15\n• Tricep Rope: 3x15" },
      { day: "Tuesday", name: "Back & Biceps Pull Split", rest: false, note: "• Barbell Deadlift: 4x6\n• Lat Pulldown: 3x10-12\n• Seated Cable Row: 3x12\n• Incline DB Curls: 3x12" },
      { day: "Wednesday", name: "Active Recovery & Mobility", rest: true, note: "• 30-minute light brisk walk\n• Foam rolling & hamstring stretching\n• 3.5L hydration" },
      { day: "Thursday", name: "Legs & Core Power", rest: false, note: "• Barbell Squat: 4x8\n• Romanian Deadlift: 3x10\n• Leg Press: 3x12\n• Hanging Leg Raises: 3x15" },
      { day: "Friday", name: "Shoulders & Arms Hypertrophy", rest: false, note: "• Overhead Press: 4x8\n• Lateral Raises: 4x15\n• Hammer Curls: 3x12\n• Dips: 3x failure" },
      { day: "Saturday", name: "Cardio Conditioning & Core", rest: false, note: "• Assault Bike: 5x 1 min intervals\n• Kettlebell Swings: 4x20\n• Plank holds: 3x 60s" },
      { day: "Sunday", name: "Full Rest Day", rest: true, note: "• Complete rest\n• Prioritize 8+ hours sleep\n• Prep meals for upcoming week" },
    ];

    const workoutInserts = defaultDays.map((d) => ({
      member_id: memberId,
      day: d.day,
      workout_name: d.name,
      is_rest_day: d.rest,
      workout_note: d.note,
    }));

    await adminClient.from("workout_plans").insert(workoutInserts);

    // 4. Seed default 7-Day Diet Note Split
    const dietInserts = defaultDays.map((d) => ({
      member_id: memberId,
      day: d.day,
      diet_title: "Daily Nutrition & Fuel Protocol",
      daily_calories_target: 2200,
      diet_note: `• Breakfast: 4 eggs + 60g oats with berries\n• Lunch: 200g chicken/paneer, 150g rice, greens\n• Pre-Workout: 1 scoop whey + 1 banana\n• Dinner: 220g fish/tofu, sweet potato, salad\n• Hydration: Drink 3.5 Liters of water daily.`,
    }));

    await adminClient.from("diet_plans").insert(dietInserts);

    // 5. Record initial payment if Paid
    if (payment_status === "Paid") {
      await adminClient.from("payments").insert({
        member_id: memberId,
        invoice_no: `INV-${Date.now().toString().slice(-6)}`,
        plan_name: membership_plan || "Quarterly Elite VIP",
        amount: membership_fee ? Number(membership_fee) : 9500,
        status: "Paid",
        payment_method: "UPI / Direct",
      });
    }

    return NextResponse.json({
      success: true,
      member: {
        id: memberId,
        full_name,
        phone: normalizedPhone,
        membership_plan,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
