import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WebinarRoom } from "@/components/webinar/webinar-room";

export default async function WebinarPage({
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

  // Check if user is registered (unless they're the host)
  if (webinar.host_id !== session.user.id) {
    const { data: registration } = await supabase
      .from("webinar_registrations")
      .select("id")
      .eq("webinar_id", resolvedParams.id)
      .eq("user_id", session.user.id)
      .single();

    if (!registration && webinar.status !== "live") {
      redirect("/webinars");
    }
  }

  return <WebinarRoom webinar={webinar} userId={session.user.id} />;
}

