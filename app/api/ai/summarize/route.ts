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

    const { webinarId, summaryType = "final" } = await request.json();

    // Get all transcripts
    const { data: transcripts } = await supabase
      .from("transcripts")
      .select("text, timestamp")
      .eq("webinar_id", webinarId)
      .order("timestamp", { ascending: true });

    // Get chat messages
    const { data: messages } = await supabase
      .from("chat_messages")
      .select("message, created_at")
      .eq("webinar_id", webinarId)
      .order("created_at", { ascending: true });

    // Get Q&A
    const { data: qa } = await supabase
      .from("qa_questions")
      .select("question, answer")
      .eq("webinar_id", webinarId)
      .not("answer", "is", null);

    const { data: webinar } = await supabase
      .from("webinars")
      .select("title, description")
      .eq("id", webinarId)
      .single();

    const transcriptText = transcripts?.map((t) => t.text).join("\n") || "";
    const chatText = messages?.map((m) => m.message).join("\n") || "";
    const qaText = qa?.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join("\n\n") || "";

    const prompt = `
Webinar Title: ${webinar?.title || "Unknown"}
Webinar Description: ${webinar?.description || ""}

Full Transcript:
${transcriptText}

Chat Messages:
${chatText}

Q&A Session:
${qaText}

Please provide a comprehensive ${summaryType === "realtime" ? "brief real-time" : "final"} summary of this webinar including:
1. Key points and main topics discussed
2. Important insights or takeaways
3. Notable questions and answers
4. Overall summary

Format the response as JSON with the following structure:
{
  "summary": "Overall summary text",
  "keyPoints": ["point 1", "point 2", ...],
  "topics": ["topic 1", "topic 2", ...],
  "keywords": ["keyword 1", "keyword 2", ...],
  "highlights": ["highlight 1", "highlight 2", ...]
}
    `.trim();

    const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });
    const res = await model.generateContent(
      `You are an AI assistant that creates comprehensive summaries of webinars. Always respond with valid JSON only.\n\n${prompt}`
    );
    const responseText = res.response.text() || "{}";
    let summaryData: any;
    try {
      summaryData = JSON.parse(responseText);
    } catch {
      // attempt to extract JSON block if extra text present
      const match = responseText.match(/\{[\s\S]*\}/);
      summaryData = match ? JSON.parse(match[0]) : { summary: responseText, keyPoints: [], topics: [], keywords: [], highlights: [] };
    }

    // Save to database
    const { data: summaryRecord, error } = await supabase
      .from("ai_summaries")
      .insert({
        webinar_id: webinarId,
        summary_type: summaryType,
        content: summaryData.summary || "",
        key_points: summaryData.keyPoints || [],
        topics: summaryData.topics || [],
        keywords: summaryData.keywords || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving summary:", error);
    }

    return NextResponse.json({ summary: summaryData, id: summaryRecord?.id });
  } catch (error: any) {
    console.error("AI Summarize Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

