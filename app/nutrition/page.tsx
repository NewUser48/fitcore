"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NutritionRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/trainer/diet");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#10151B] flex items-center justify-center text-text-muted text-sm font-mono">
      Redirecting to Trainer Diet Notes...
    </div>
  );
}
