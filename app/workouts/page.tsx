"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkoutsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/trainer/workouts");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#10151B] flex items-center justify-center text-text-muted text-sm font-mono">
      Redirecting to Trainer Workout Notes...
    </div>
  );
}
