import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HostDashboard } from "@/components/dashboard/host-dashboard";
import { AttendeeDashboard } from "@/components/dashboard/attendee-dashboard";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Get user profile to determine role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  const userRole = profile?.role || "attendee";

  if (userRole === "host") {
    return <HostDashboard userId={session.user.id} />;
  }

  return <AttendeeDashboard userId={session.user.id} />;
}

