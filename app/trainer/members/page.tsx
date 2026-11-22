"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddMemberDialog } from "@/components/trainer/add-member-dialog";
import { fitcoreMembers } from "@/lib/mock-data";
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
} from "lucide-react";
import { toast } from "sonner";

export default function TrainerMembersPage() {
  const [members, setMembers] = React.useState<MemberProfile[]>(fitcoreMembers);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");
  const [isAddOpen, setIsAddOpen] = React.useState(false);

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
    setMembers((prev) => [newMember, ...prev]);
    toast.success(`Enrolled & provisioned ${newMember.full_name}!`);
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
              {filteredMembers.length} Athletes
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
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <Card key={member.id} glowOnHover className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url || ""}
                      alt={member.full_name}
                      className="h-12 w-12 rounded-2xl object-cover border border-primary/30"
                    />
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
                <span className="text-primary font-semibold">Managed</span>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[#1E2630] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar_url || ""}
                          alt={member.full_name}
                          className="h-8 w-8 rounded-xl object-cover border border-border"
                        />
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
    </TrainerShell>
  );
}
