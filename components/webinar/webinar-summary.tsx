"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import jsPDF from "jspdf";

interface WebinarSummaryProps {
  webinar: any;
}

export function WebinarSummary({ webinar }: WebinarSummaryProps) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [webinar.id]);

  const loadSummary = async () => {
    try {
      const response = await fetch(`/api/webinars/${webinar.id}/summary`);
      const data = await response.json();
      setSummary(data.summary || data);
    } catch (error) {
      console.error("Error loading summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!summary) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(webinar.title, 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${formatDate(webinar.scheduled_at)}`, 20, 30);

    let y = 40;
    doc.setFontSize(14);
    doc.text("Summary", 20, y);
    y += 10;
    doc.setFontSize(10);

    const summaryText = doc.splitTextToSize(summary.content || summary.summary || "", 170);
    doc.text(summaryText, 20, y);
    y += summaryText.length * 5 + 10;

    if (summary.keyPoints || summary.key_points) {
      doc.setFontSize(14);
      doc.text("Key Points", 20, y);
      y += 10;
      doc.setFontSize(10);
      const points = summary.keyPoints || summary.key_points || [];
      points.forEach((point: string) => {
        const pointText = doc.splitTextToSize(`• ${point}`, 170);
        doc.text(pointText, 20, y);
        y += pointText.length * 5 + 3;
      });
    }

    doc.save(`${webinar.title}-summary.pdf`);
  };

  const exportToMarkdown = () => {
    if (!summary) return;

    const markdown = `# ${webinar.title}

Date: ${formatDate(webinar.scheduled_at)}

## Summary

${summary.content || summary.summary || ""}

## Key Points

${(summary.keyPoints || summary.key_points || []).map((p: string) => `- ${p}`).join("\n")}

## Topics

${(summary.topics || []).map((t: string) => `- ${t}`).join("\n")}

## Keywords

${(summary.keywords || []).join(", ")}
    `;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${webinar.title}-summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading summary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{webinar.title}</CardTitle>
                <CardDescription>{formatDate(webinar.scheduled_at)}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={exportToMarkdown}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export Markdown
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {summary && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Summary</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {summary.content || summary.summary || "No summary available"}
                  </p>
                </div>

                {(summary.keyPoints || summary.key_points) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Points</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {(summary.keyPoints || summary.key_points || []).map(
                        (point: string, idx: number) => (
                          <li key={idx}>{point}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {summary.topics && summary.topics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Topics Discussed</h3>
                    <div className="flex flex-wrap gap-2">
                      {summary.topics.map((topic: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {summary.keywords && summary.keywords.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {summary.keywords.map((keyword: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!summary && (
              <div className="text-center py-12">
                <p className="text-gray-500">No summary available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

