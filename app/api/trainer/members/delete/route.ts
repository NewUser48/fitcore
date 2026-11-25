import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Member id is required." }, { status: 400 });
    }

    // Demo/seeded member ids are not UUIDs - nothing persisted to remove.
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ success: true, mock: true });
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json({ success: true, mock: true });
    }

    // Deleting the Auth user cascades to profiles -> members -> all child records.
    const { error } = await adminClient.auth.admin.deleteUser(id);

    if (error) {
      // If the Auth user was already removed, clean up the roster row directly.
      if (/not found|does not exist/i.test(error.message)) {
        await adminClient.from("members").delete().eq("id", id);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { error: error.message || "Failed to delete member." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
