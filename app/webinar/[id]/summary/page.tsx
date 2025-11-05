import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WebinarSummary } from "@/components/webinar/webinar-summary";

export default async function WebinarSummaryPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await (typeof params === 'object' && 'then' in params ? params : Promise.resolve(params));
  
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data: webinar } = await supabase
    .from("webinars")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!webinar) {
    redirect("/webinars");
  }

  return <WebinarSummary webinar={webinar} />;
}

