"use client";

import * as React from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { mapMemberRow, type MemberRow } from "@/lib/supabase/mappers";
import { fitcoreMembers } from "@/lib/mock-data";
import type { MemberProfile } from "@/types";

/**
 * Loads the live member roster from Supabase and keeps it in sync when a
 * member is created, updated or deleted from anywhere in the trainer app.
 * Falls back to the bundled demo roster when Supabase is not configured.
 */
export function useTrainerMembers() {
  const [members, setMembers] = React.useState<MemberProfile[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const reload = React.useCallback(async () => {
    const supabase = createClient();

    if (!supabase) {
      setMembers(fitcoreMembers);
      setIsLoading(false);
      return;
    }

    const [{ data: rows, error }, { data: profiles }] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, avatar_url"),
    ]);

    if (error) {
      toast.error(`Could not load athletes: ${error.message}`);
      setIsLoading(false);
      return;
    }

    const avatars = new Map<string, string | null>(
      (profiles ?? []).map((p: any) => [p.id, p.avatar_url])
    );

    setMembers(
      ((rows ?? []) as MemberRow[]).map((row) => mapMemberRow(row, avatars.get(row.id)))
    );
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  React.useEffect(() => {
    const refresh = () => reload();
    window.addEventListener("fitcore:member-created", refresh);
    window.addEventListener("fitcore:members-changed", refresh);
    return () => {
      window.removeEventListener("fitcore:member-created", refresh);
      window.removeEventListener("fitcore:members-changed", refresh);
    };
  }, [reload]);

  return { members, setMembers, isLoading, reload };
}
