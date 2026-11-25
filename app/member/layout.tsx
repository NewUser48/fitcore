import { MemberPortalProvider } from "@/components/member/member-portal-provider";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MemberPortalProvider>{children}</MemberPortalProvider>;
}
