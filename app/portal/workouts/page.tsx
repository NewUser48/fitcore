"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalWorkoutsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/member/workouts");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#10151B] flex items-center justify-center text-text-muted text-sm font-mono">
      Redirecting to Athlete Workout Notes...
    </div>
  );
}
