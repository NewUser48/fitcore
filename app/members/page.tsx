"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { AddMemberModal } from "@/components/modals/add-member-modal";
import { sampleMembers, sampleMembershipPlans } from "@/lib/mock-data";
import { Member, MembershipStatus } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Search,
  Plus,
  Download,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Phone,
  Mail,
  Calendar,
  Dumbbell,
  Scale,
  Activity,
  HeartPulse,
  User,
  UtensilsCrossed,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  X,
  Clock,
} from "lucide-react";

export default function MembersPage() {
  const [members, setMembers] = React.useState<Member[]>(sampleMembers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [planFilter, setPlanFilter] = React.useState<string>("all");
  const [sortOrder, setSortOrder] = React.useState<"desc" | "asc">("desc");
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [profileTab, setProfileTab] = React.useState("overview");

  // Filter and sort logic
  const filteredMembers = React.useMemo(() => {
    return members
      .filter((m) => {
        const matchesSearch =
          m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.phone.includes(searchQuery) ||
          (m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          m.fitness_goal.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || m.membership_status === statusFilter;

        const matchesPlan =
          planFilter === "all" || m.membership_plan_name === planFilter;

        return matchesSearch && matchesStatus && matchesPlan;
      })
      .sort((a, b) => {
        const dateA = new Date(a.joining_date).getTime();
        const dateB = new Date(b.joining_date).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [members, searchQuery, statusFilter, planFilter, sortOrder]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "Gender",
      "Fitness Goal",
      "Plan",
      "Status",
      "Joining Date",
      "Membership End Date",
      "Current Weight (kg)",
      "Height (cm)",
      "Pending Dues (INR)",
    ];

    const rows = filteredMembers.map((m) => [
      m.id,
      `"${m.full_name}"`,
      m.email || "",
      m.phone,
      m.gender || "N/A",
      `"${m.fitness_goal}"`,
      `"${m.membership_plan_name || "N/A"}"`,
      m.membership_status,
      m.joining_date,
      m.membership_end_date,
      m.current_weight_kg,
      m.height_cm,
      m.pending_dues || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `apex_members_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMemberAdded = (formData: any) => {
    const newMember: Member = {
      id: `mem_${Date.now()}`,
      trainer_id: "trainer_fitcore_01",
      role: "member",
      experience_level: "intermediate",
      payment_status: "paid",
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      date_of_birth: formData.dob,
      gender: formData.gender,
      height_cm: Number(formData.heightCm),
      starting_weight_kg: Number(formData.startingWeightKg),
      current_weight_kg: Number(formData.startingWeightKg),
      target_weight_kg: Number(formData.targetWeightKg),
      fitness_goal: formData.fitnessGoal,
      joining_date: formData.startDate,
      membership_start_date: formData.startDate,
      membership_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      membership_plan_name:
        sampleMembershipPlans.find((p) => p.id === formData.planId)?.name ||
        "Monthly Plan",
      membership_status: "active",
      emergency_contact_name: formData.emergencyName,
      emergency_contact_phone: formData.emergencyPhone,
      medical_notes: formData.medicalNotes,
      trainer_notes: formData.trainerNotes,
      attendance_rate: 100,
      total_sessions_attended: 0,
      pending_dues: 0,
      created_at: new Date().toISOString(),
      avatar_url:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Athlete Directory
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              {filteredMembers.length} Members
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Complete member records, biometrics, active programs, and attendance tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>

          <Button
            onClick={() => setIsAddOpen(true)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2 shadow-lime-glow-sm"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by name, phone, or goal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus-visible:outline-none focus-visible:border-primary/70"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired / Overdue</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus-visible:outline-none focus-visible:border-primary/70"
            >
              <option value="all">All Plans</option>
              {sampleMembershipPlans.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Controls: Sort and Card/Table View */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl border border-border bg-[#151B22] px-3 text-xs text-text-muted hover:text-text-primary hover:border-primary/40 transition-colors"
              title="Sort by joining date"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{sortOrder === "desc" ? "Newest" : "Oldest"}</span>
            </button>

            <div className="flex items-center rounded-xl border border-border bg-[#151B22] p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "cards"
                    ? "bg-[#25303D] text-primary"
                    : "text-text-muted hover:text-text-primary"
                }`}
                title="Cards view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-[#25303D] text-primary"
                    : "text-text-muted hover:text-text-primary"
                }`}
                title="Table view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Member Records List */}
      {filteredMembers.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="text-sm font-bold text-text-primary mb-1">
            No athletes match your query
          </p>
          <p className="text-xs text-text-muted">
            Try adjusting your search filters or add a new athlete to the roster.
          </p>
        </Card>
      ) : viewMode === "cards" ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              glowOnHover
              className="p-5 flex flex-col justify-between cursor-pointer group"
              onClick={() => setSelectedMember(member)}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url || ""}
                      alt={member.full_name}
                      className="h-12 w-12 rounded-2xl object-cover border border-primary/30 group-hover:border-primary transition-colors shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                        {member.full_name}
                      </h3>
                      <p className="text-[11px] text-text-muted">
                        Joined {formatDate(member.joining_date)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      member.membership_status === "active"
                        ? "active"
                        : member.membership_status === "expiring"
                        ? "expiring"
                        : "expired"
                    }
                    dot
                  >
                    {member.membership_status}
                  </Badge>
                </div>

                <div className="rounded-xl bg-[#151B22] p-3 border border-border/60 mb-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Goal</span>
                    <span className="font-bold text-text-primary truncate max-w-[170px]">
                      {member.fitness_goal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Plan</span>
                    <span className="font-medium text-primary">
                      {member.membership_plan_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Valid Until</span>
                    <span className="font-mono text-text-primary">
                      {formatDate(member.membership_end_date)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                  <div className="p-2 rounded-lg bg-[#151B22] border border-border/40">
                    <span className="text-[10px] text-text-muted block">Weight</span>
                    <span className="font-bold text-text-primary">
                      {member.current_weight_kg} kg
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#151B22] border border-border/40">
                    <span className="text-[10px] text-text-muted block">Attendance</span>
                    <span className="font-bold text-emerald-400">
                      {member.attendance_rate || 90}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#151B22] border border-border/40">
                    <span className="text-[10px] text-text-muted block">Dues</span>
                    <span
                      className={`font-bold ${
                        (member.pending_dues || 0) > 0
                          ? "text-rose-400"
                          : "text-text-muted"
                      }`}
                    >
                      {formatCurrency(member.pending_dues || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-text-muted flex items-center gap-1 text-[11px]">
                  <Phone className="h-3 w-3" /> {member.phone}
                </span>
                <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Full Profile &rarr;
                </span>
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
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Primary Goal</th>
                  <th className="py-3 px-4">Plan & Expiry</th>
                  <th className="py-3 px-4">Biometrics</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-[#1E2630] transition-colors cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar_url || ""}
                          alt={member.full_name}
                          className="h-9 w-9 rounded-xl object-cover border border-border shrink-0"
                        />
                        <div>
                          <p className="font-bold text-text-primary">
                            {member.full_name}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            Joined {formatDate(member.joining_date)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-text-primary font-mono">{member.phone}</p>
                      <p className="text-[10px] text-text-muted">{member.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-text-primary">
                        {member.fitness_goal}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-primary">
                        {member.membership_plan_name}
                      </p>
                      <p className="text-[10px] text-text-muted font-mono">
                        Expires {formatDate(member.membership_end_date)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-text-primary">
                        {member.current_weight_kg} kg &bull; {member.height_cm} cm
                      </p>
                      <p className="text-[10px] text-emerald-400">
                        {member.attendance_rate || 90}% Attendance
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          member.membership_status === "active"
                            ? "active"
                            : member.membership_status === "expiring"
                            ? "expiring"
                            : "expired"
                        }
                        dot
                      >
                        {member.membership_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMember(member);
                        }}
                      >
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Slide-out / Modal Member Profile View with 7 Tabs */}
      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.full_name || "Athlete Profile"}
        description={`Enrolled ${selectedMember?.membership_plan_name || ""} &bull; ${selectedMember?.fitness_goal || ""}`}
        maxWidth="2xl"
      >
        {selectedMember && (
          <div className="space-y-5">
            {/* 7 Tabs as specified in prompt: Overview, Workout Plan, Diet Plan, Attendance, Progress, Payments, Notes */}
            <Tabs
              tabs={[
                { id: "overview", label: "Overview", icon: <User className="h-3.5 w-3.5" /> },
                { id: "workout", label: "Workout Plan", icon: <Dumbbell className="h-3.5 w-3.5" /> },
                { id: "diet", label: "Diet & Nutrition", icon: <UtensilsCrossed className="h-3.5 w-3.5" /> },
                { id: "attendance", label: "Attendance", icon: <Calendar className="h-3.5 w-3.5" /> },
                { id: "progress", label: "Body Progress", icon: <Scale className="h-3.5 w-3.5" /> },
                { id: "payments", label: "Payments", icon: <Receipt className="h-3.5 w-3.5" /> },
                { id: "notes", label: "Trainer Notes", icon: <HeartPulse className="h-3.5 w-3.5" /> },
              ]}
              activeTab={profileTab}
              onChange={setProfileTab}
            />

            {/* Profile Tab Contents */}
            {profileTab === "overview" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#151B22] p-4 border border-border">
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                      Biometrics & Vitals
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Height:</span>
                        <span className="font-bold text-text-primary">{selectedMember.height_cm} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Starting Weight:</span>
                        <span className="font-bold text-text-primary">{selectedMember.starting_weight_kg} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Current Weight:</span>
                        <span className="font-bold text-primary">{selectedMember.current_weight_kg} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Target Weight:</span>
                        <span className="font-bold text-text-primary">{selectedMember.target_weight_kg || "N/A"} kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#151B22] p-4 border border-border">
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                      Emergency & Contacts
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Phone:</span>
                        <span className="font-mono text-text-primary">{selectedMember.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Email:</span>
                        <span className="text-text-primary">{selectedMember.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Emergency:</span>
                        <span className="font-bold text-text-primary">{selectedMember.emergency_contact_name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Emergency Phone:</span>
                        <span className="font-mono text-text-primary">{selectedMember.emergency_contact_phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedMember.medical_notes && (
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                      <span className="text-xs font-bold text-rose-400">
                        Restricted Medical Notes & Flags
                      </span>
                    </div>
                    <p className="text-xs text-text-primary">
                      {selectedMember.medical_notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {profileTab === "workout" && (
              <div className="p-4 rounded-xl bg-[#151B22] border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-primary">
                    Assigned Routine: Hypertrophy 4-Day Periodization
                  </h4>
                  <Badge variant="primary">Active Routine</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#1C242D] border border-border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-text-primary">Day 1: Heavy Upper Push & Delts</p>
                      <p className="text-[10px] text-text-muted">Barbell Incline Bench (4x8) &bull; Seated DB Press (3x10)</p>
                    </div>
                    <span className="text-primary font-bold">4 Exercises</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1C242D] border border-border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-text-primary">Day 2: Posterior Chain & Hamstrings</p>
                      <p className="text-[10px] text-text-muted">Trap Bar Deadlift (5x5) &bull; Romanian Deadlift (3x12)</p>
                    </div>
                    <span className="text-primary font-bold">5 Exercises</span>
                  </div>
                </div>
              </div>
            )}

            {profileTab === "diet" && (
              <div className="p-4 rounded-xl bg-[#151B22] border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-primary">
                    Daily Targets: 2,400 kcal &bull; 175g Protein
                  </h4>
                  <Badge variant="active">Trainer Controlled</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-[#1C242D]">
                    <span className="text-[10px] text-text-muted">Protein</span>
                    <p className="font-bold text-primary">175g (30%)</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1C242D]">
                    <span className="text-[10px] text-text-muted">Carbs</span>
                    <p className="font-bold text-sky-400">260g (45%)</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1C242D]">
                    <span className="text-[10px] text-text-muted">Fats</span>
                    <p className="font-bold text-amber-400">65g (25%)</p>
                  </div>
                </div>
              </div>
            )}

            {profileTab === "attendance" && (
              <div className="p-4 rounded-xl bg-[#151B22] border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary">
                    Total Sessions Attended: {selectedMember.total_sessions_attended || 32}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {selectedMember.attendance_rate || 92}% Reliability
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  Last check-in: Yesterday at 07:15 AM (Logged by Trainer)
                </p>
              </div>
            )}

            {profileTab === "progress" && (
              <div className="p-4 rounded-xl bg-[#151B22] border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary">
                    Weight Progression
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {(selectedMember.current_weight_kg - selectedMember.starting_weight_kg).toFixed(1)} kg delta
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  Personal Record: Trap Bar Deadlift 160kg (Nov 20, 2026)
                </p>
              </div>
            )}

            {profileTab === "payments" && (
              <div className="p-4 rounded-xl bg-[#151B22] border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary">
                    Plan: {selectedMember.membership_plan_name}
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {formatCurrency(selectedMember.pending_dues || 0)} Pending
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  Valid from {formatDate(selectedMember.membership_start_date)} to {formatDate(selectedMember.membership_end_date)}
                </p>
              </div>
            )}

            {profileTab === "notes" && (
              <div className="p-4 rounded-xl bg-[#151B22] border border-border space-y-2">
                <h4 className="text-xs font-bold text-text-primary">
                  Coach Confidential Observations
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {selectedMember.trainer_notes || "No additional trainer observations logged yet."}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-border">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedMember(null)}
              >
                Close Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onMemberAdded={handleMemberAdded}
      />
    </DashboardShell>
  );
}
