"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddMemberDialog } from "@/components/trainer/add-member-dialog";
import { EditMemberDialog } from "@/components/trainer/edit-member-dialog";
import { DeleteMemberDialog } from "@/components/trainer/delete-member-dialog";
import { useTrainerMembers } from "@/lib/supabase/use-trainer-members";
import { MemberProfile } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Search,
  Plus,
  Download,
  LayoutGrid,
  List,
  Phone,
  Mail,
  Calendar,
  Activity,
  HeartPulse,
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function TrainerMembersPage() {
  const { members, setMembers, isLoading, reload } = useTrainerMembers();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<MemberProfile | null>(null);
  const [deletingMember, setDeletingMember] = React.useState<MemberProfile | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filteredMembers = React.useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.full_name.toLowerCase().includes(search.toLowerCase()) ||
        m.phone.includes(search) ||
        m.fitness_goal.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || m.membership_status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [members, search, statusFilter]);

  const handleMemberCreated = (newMember: MemberProfile) => {
    setMembers((prev) => [newMember, ...prev.filter((m) => m.id !== newMember.id)]);
    toast.success(`Enrolled & provisioned ${newMember.full_name}!`);
    reload();
  };

  const handleMemberUpdated = (updated: MemberProfile) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    window.dispatchEvent(new CustomEvent("fitcore:members-changed"));
  };

  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/trainer/members/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingMember.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete member");

      const removedName = deletingMember.full_name;
      setMembers((prev) => prev.filter((m) => m.id !== deletingMember.id));
      setDeletingMember(null);
      toast.success(`${removedName} removed from the roster.`);
      window.dispatchEvent(new CustomEvent("fitcore:members-changed"));
      reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete member.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Full Name",
      "Phone (E.164)",
      "Email",
      "Goal",
      "Plan",
      "Status",
      "Fee (INR)",
      "Start Date",
      "End Date",
      "Starting Wt (kg)",
      "Current Wt (kg)",
    ];
    const rows = filteredMembers.map((m) => [
      m.id,
      `"${m.full_name}"`,
      m.phone,
      m.email || "",
      `"${m.fitness_goal}"`,
      `"${m.membership_plan_name}"`,
      m.membership_status,
      m.membership_fee,
      m.membership_start_date,
      m.membership_end_date,
      m.starting_weight_kg,
      m.current_weight_kg,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `fitcore_members_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported athlete roster as CSV!");
  };

  return (
    <TrainerShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Athlete Roster Management
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              {isLoading ? "…" : filteredMembers.length} Athletes
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Provision member Auth accounts, manage biometrics, emergency records, and assign workout/diet plans.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center gap-1.5">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="shadow-lime-glow-sm flex items-center gap-1.5 font-bold"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Add New Member</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search by athlete name, phone (+91), or fitness goal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 h-10 rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Members</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired Plans</option>
            </select>

            <div className="flex items-center rounded-xl border border-border bg-[#151B22] p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "cards" ? "bg-[#25303D] text-primary" : "text-text-muted"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table" ? "bg-[#25303D] text-primary" : "text-text-muted"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Roster View */}
      {isLoading ? (
        <Card className="p-10 text-center text-sm text-text-muted">Loading athletes…</Card>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <Card key={member.id} glowOnHover className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">
                        {member.full_name}
                      </h3>
                      <p className="text-[11px] text-primary font-mono mt-0.5">
                        {member.phone}
                      </p>
                    </div>
                  </div>
                  <Badge variant={member.membership_status === "active" ? "active" : member.membership_status === "expiring" ? "expiring" : "expired"} dot>
                    {member.membership_status}
                  </Badge>
                </div>

                <div className="rounded-xl bg-[#151B22] p-3 border border-border/60 mb-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Goal:</span>
                    <span className="font-bold text-text-primary truncate max-w-[170px]">{member.fitness_goal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Plan:</span>
                    <span className="font-medium text-primary">{member.membership_plan_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Valid Till:</span>
                    <span className="font-mono text-text-primary">{formatDate(member.membership_end_date)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                  <div className="p-2 rounded-lg bg-[#151B22] border border-border/40">
                    <span className="text-[10px] text-text-muted block">Current Wt</span>
                    <span className="font-bold text-text-primary">{member.current_weight_kg} kg</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#151B22] border border-border/40">
                    <span className="text-[10px] text-text-muted block">Height</span>
                    <span className="font-bold text-text-primary">{member.height_cm} cm</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#151B22] border border-border/40">
                    <span className="text-[10px] text-text-muted block">Level</span>
                    <span className="font-bold text-emerald-400 capitalize">{member.experience_level}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-text-muted text-[11px]">Emergency: {member.emergency_contact_phone || "N/A"}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="p-1.5 rounded-lg border border-border text-text-muted hover:text-primary hover:border-primary/50 transition-colors"
                    title="Edit member"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingMember(member)}
                    className="p-1.5 rounded-lg border border-border text-text-muted hover:text-rose-400 hover:border-rose-500/50 transition-colors"
                    title="Delete member"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Professional Table View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151B22] text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Athlete</th>
                  <th className="py-3 px-4">Login Phone (E.164)</th>
                  <th className="py-3 px-4">Goal</th>
                  <th className="py-3 px-4">Plan & Expiry</th>
                  <th className="py-3 px-4">Current Weight</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[#1E2630] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-bold text-text-primary">{member.full_name}</p>
                          <p className="text-[10px] text-text-muted">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      {member.phone}
                    </td>
                    <td className="py-3 px-4 font-medium text-text-primary">
                      {member.fitness_goal}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-text-primary">{member.membership_plan_name}</p>
                      <p className="text-[10px] text-text-muted font-mono">Expires {formatDate(member.membership_end_date)}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-text-primary">
                      {member.current_weight_kg} kg
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={member.membership_status === "active" ? "active" : member.membership_status === "expiring" ? "expiring" : "expired"} dot>
                        {member.membership_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingMember(member)}
                          className="p-1.5 rounded-lg border border-border text-text-muted hover:text-primary hover:border-primary/50 transition-colors"
                          title="Edit member"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingMember(member)}
                          className="p-1.5 rounded-lg border border-border text-text-muted hover:text-rose-400 hover:border-rose-500/50 transition-colors"
                          title="Delete member"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Member Dialog */}
      <AddMemberDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onMemberCreated={handleMemberCreated}
      />

      {/* Edit Member Dialog */}
      <EditMemberDialog
        member={editingMember}
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        onMemberUpdated={handleMemberUpdated}
      />

      {/* Delete Member Dialog */}
      <DeleteMemberDialog
        isOpen={!!deletingMember}
        memberName={deletingMember?.full_name}
        isDeleting={isDeleting}
        onCancel={() => setDeletingMember(null)}
        onConfirm={handleDeleteMember}
      />
    </TrainerShell>
  );
}
