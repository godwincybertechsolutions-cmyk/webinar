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

    const { question, webinarId } = await request.json();

    // Get recent transcripts and chat messages for context
    const { data: transcripts } = await supabase
      .from("transcripts")
      .select("text")
      .eq("webinar_id", webinarId)
      .order("timestamp", { ascending: false })
      .limit(20);

    const { data: messages } = await supabase
      .from("chat_messages")
      .select("message")
      .eq("webinar_id", webinarId)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: webinar } = await supabase
      .from("webinars")
      .select("title, description")
      .eq("id", webinarId)
      .single();

    // Build context
    const transcriptContext = transcripts?.map((t) => t.text).join("\n") || "";
    const chatContext = messages?.map((m) => m.message).join("\n") || "";

    const context = `
Webinar Title: ${webinar?.title || "Unknown"}
Webinar Description: ${webinar?.description || ""}

Recent Transcripts:
${transcriptContext}

Recent Chat Messages:
${chatContext}

Based on the above context from the ongoing webinar, please answer the following question:
${question}

Provide a concise and helpful answer based on the webinar content. If the question cannot be answered from the context, say so politely.
    `.trim();

    const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `You are an AI assistant helping webinar attendees by answering questions based on the live webinar content. Be concise, accurate, and helpful.\n\n${context}`;
    const res = await model.generateContent(prompt);
    const answer = res.response.text() || "I couldn't generate an answer. Please try again.";

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("AI Answer Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

