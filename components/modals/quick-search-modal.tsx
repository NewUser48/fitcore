"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Search, User, Dumbbell, Calendar, CreditCard, ArrowRight } from "lucide-react";
import { sampleMembers } from "@/lib/mock-data";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const filteredMembers = React.useMemo(() => {
    if (!query.trim()) return sampleMembers.slice(0, 4);
    const q = query.toLowerCase();
    return sampleMembers.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.fitness_goal.toLowerCase().includes(q) ||
        m.membership_plan_name?.toLowerCase().includes(q)
    );
  }, [query]);

  const quickNav = [
    { label: "Active Members Directory", href: "/members", icon: User },
    { label: "Workout Template Builder", href: "/workouts", icon: Dumbbell },
    { label: "Daily Schedule & Sessions", href: "/schedule", icon: Calendar },
    { label: "Fee & Payment History", href: "/billing", icon: CreditCard },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="space-y-4">
        {/* Search Header */}
        <div className="relative">
          <Input
            autoFocus
            type="text"
            placeholder="Type member name, phone number, or fitness goal..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<Search className="h-4 w-4 text-primary" />}
            className="text-sm py-2.5 h-11 bg-[#10151B] border-primary/40 shadow-lime-glow-sm"
          />
        </div>

        {/* Member Search Results */}
        <div>
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              {query.trim() ? "Search Results" : "Recent Members"}
            </span>
            <span className="text-[11px] text-text-dim">
              {filteredMembers.length} found
            </span>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto no-scrollbar">
            {filteredMembers.length === 0 ? (
              <div className="py-6 text-center text-xs text-text-muted">
                No members found matching &quot;{query}&quot;
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    onClose();
                    router.push(`/members?id=${member.id}`);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#151B22] border border-border/70 hover:border-primary/50 hover:bg-[#1E2630] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url || ""}
                      alt={member.full_name}
                      className="h-8 w-8 rounded-lg object-cover border border-border"
                    />
                    <div>
                      <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                        {member.full_name}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {member.fitness_goal} &bull; {member.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-dim">
                      {member.membership_plan_name}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="border-t border-border pt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted px-1 mb-2 block">
            Quick Navigation
          </span>
          <div className="grid grid-cols-2 gap-2">
            {quickNav.map((nav) => {
              const Icon = nav.icon;
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  onClick={onClose}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#151B22] border border-border/50 text-xs text-text-muted hover:text-text-primary hover:border-primary/30 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="truncate">{nav.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
