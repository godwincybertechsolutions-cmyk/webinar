import { NextRequest, NextResponse } from "next/server";
import { generateLiveKitToken } from "@/lib/livekit";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { roomName, participantName, participantIdentity, canPublish, canSubscribe } = body;

    const token = await generateLiveKitToken(
      roomName,
      participantName,
      participantIdentity,
      canPublish,
      canSubscribe
    );

    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

