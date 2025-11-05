"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

interface RegisteredWebinar {
  id: string;
  webinar: {
    id: string;
    title: string;
    description: string;
    scheduled_at: string;
    status: string;
    thumbnail_url: string | null;
  };
  attended: boolean;
}

export function AttendeeDashboard({ userId }: { userId: string }) {
  const [webinars, setWebinars] = useState<RegisteredWebinar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWebinars();
  }, [userId]);

  const loadWebinars = async () => {
    try {
      const { data, error } = await supabase
        .from("webinar_registrations")
        .select("*, webinar:webinars(*)")
        .eq("user_id", userId)
        .order("registered_at", { ascending: false });

      if (error) throw error;

      setWebinars(data || []);
    } catch (error) {
      console.error("Error loading webinars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Webinars
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/webinars">
              <Button variant="outline">Browse Webinars</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Registered Webinars</CardTitle>
            <CardDescription>Webinars you've registered for</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : webinars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No registered webinars yet</p>
                <Link href="/webinars">
                  <Button>Browse Available Webinars</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {webinars.map((registration) => {
                  const webinar = registration.webinar as any;
                  return (
                    <motion.div
                      key={registration.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{webinar.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {formatDate(webinar.scheduled_at)}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs ${
                                webinar.status === "live"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : webinar.status === "upcoming"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {webinar.status}
                            </span>
                            {registration.attended && (
                              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Attended
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {(webinar.status === "live" || webinar.status === "upcoming") && (
                            <Link href={`/webinar/${webinar.id}`}>
                              <Button>
                                {webinar.status === "live" ? "Join Live" : "View Details"}
                              </Button>
                            </Link>
                          )}
                          {webinar.status === "completed" && (
                            <Link href={`/webinar/${webinar.id}/summary`}>
                              <Button variant="outline">View Summary</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

