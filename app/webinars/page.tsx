"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Calendar, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

interface Webinar {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  status: string;
  thumbnail_url: string | null;
  host_id: string;
  profiles: {
    full_name: string;
  };
}

export default function WebinarsPage() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "live">("all");

  useEffect(() => {
    loadWebinars();
  }, [filter]);

  const loadWebinars = async () => {
    try {
      let query = supabase
        .from("webinars")
        .select("*, profiles:host_id(full_name)")
        .order("scheduled_at", { ascending: true });

      if (filter === "upcoming") {
        query = query.eq("status", "upcoming");
      } else if (filter === "live") {
        query = query.eq("status", "live");
      }

      const { data, error } = await query;

      if (error) throw error;
      setWebinars(data || []);
    } catch (error) {
      console.error("Error loading webinars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (webinarId: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/auth/login";
        return;
      }

      const { error } = await supabase.from("webinar_registrations").insert({
        webinar_id: webinarId,
        user_id: session.user.id,
      });

      if (error) throw error;
      alert("Successfully registered!");
      loadWebinars();
    } catch (error: any) {
      alert(error.message || "Failed to register");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Webinar
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Available Webinars</h1>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "upcoming" ? "default" : "outline"}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === "live" ? "default" : "outline"}
              onClick={() => setFilter("live")}
            >
              Live Now
            </Button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : webinars.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No webinars found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinars.map((webinar) => (
              <motion.div
                key={webinar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  {webinar.thumbnail_url && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                      <img
                        src={webinar.thumbnail_url}
                        alt={webinar.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{webinar.title}</CardTitle>
                    <CardDescription>
                      Host: {webinar.profiles?.full_name || "Unknown"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {webinar.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4" />
                      {formatDate(webinar.scheduled_at)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          webinar.status === "live"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {webinar.status}
                      </span>
                      {webinar.status === "live" ? (
                        <Link href={`/webinar/${webinar.id}`}>
                          <Button size="sm">
                            Join <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" onClick={() => handleRegister(webinar.id)}>
                          Register
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

