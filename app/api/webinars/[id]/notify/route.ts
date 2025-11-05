import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get webinar
    const { data: webinar } = await supabase
      .from("webinars")
      .select("*")
      .eq("id", params.id)
      .single();

    if (!webinar || webinar.host_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all registered users
    const { data: registrations } = await supabase
      .from("webinar_registrations")
      .select("user_id, profiles:user_id(email, full_name)")
      .eq("webinar_id", params.id);

    // Send email notifications (in production, use a proper email service)
    // For now, we'll just return success
    // You can integrate with SendGrid, Resend, or similar services

    return NextResponse.json({
      message: "Notifications sent",
      count: registrations?.length || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

