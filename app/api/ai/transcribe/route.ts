import { NextRequest, NextResponse } from "next/server";
import { gemini } from "@/lib/openai";
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

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const webinarId = formData.get("webinarId") as string;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Convert File to base64 for Gemini inlineData
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Use Gemini 1.5 Pro for audio transcription via multimodal input
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });
    const res = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: "Transcribe this audio to English text." },
            { inlineData: { data: base64, mimeType: (audioFile as any).type || "audio/mpeg" } },
          ],
        },
      ],
    });
    const transcriptText = res.response.text();

    // Save transcript to database
    await supabase.from("transcripts").insert({
      webinar_id: webinarId,
      text: transcriptText,
      speaker: "auto",
    });

    return NextResponse.json({ text: transcriptText });
  } catch (error: any) {
    console.error("Transcription Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

