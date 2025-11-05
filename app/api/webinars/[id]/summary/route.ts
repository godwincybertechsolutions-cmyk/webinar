import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
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

    // Get webinar summary
    const { data: summary } = await supabase
      .from("ai_summaries")
      .select("*")
      .eq("webinar_id", params.id)
      .eq("summary_type", "final")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // If no final summary exists, generate one
    if (!summary) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webinarId: params.id, summaryType: "final" }),
      });

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

