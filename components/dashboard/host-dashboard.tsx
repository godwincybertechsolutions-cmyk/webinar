"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Video, Users, MessageSquare, Calendar } from "lucide-react";
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
}

export function HostDashboard({ userId }: { userId: string }) {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    live: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadWebinars = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("webinars")
        .select("*")
        .eq("host_id", userId)
        .order("scheduled_at", { ascending: false });

      if (error) throw error;

      setWebinars(data || []);

      // Calculate stats
      const upcoming = data?.filter((w) => w.status === "upcoming").length || 0;
      const live = data?.filter((w) => w.status === "live").length || 0;
      const completed = data?.filter((w) => w.status === "completed").length || 0;

      setStats({
        total: data?.length || 0,
        upcoming,
        live,
        completed,
      });
    } catch (error) {
      console.error("Error loading webinars:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadWebinars();
  }, [loadWebinars]);

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
            Host Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/webinars/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Webinar
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Webinars</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Video className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                    <p className="text-2xl font-bold">{stats.upcoming}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Live Now</p>
                    <p className="text-2xl font-bold">{stats.live}</p>
                  </div>
                  <Users className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Webinars List */}
        <Card>
          <CardHeader>
            <CardTitle>My Webinars</CardTitle>
            <CardDescription>Manage and view all your webinars</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : webinars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No webinars yet</p>
                <Link href="/webinars/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Webinar
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {webinars.map((webinar) => (
                  <motion.div
                    key={webinar.id}
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
                        <span
                          className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                            webinar.status === "live"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : webinar.status === "upcoming"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {webinar.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {webinar.status === "live" && (
                          <Link href={`/webinar/${webinar.id}`}>
                            <Button>Join Live</Button>
                          </Link>
                        )}
                        <Link href={`/webinars/${webinar.id}/edit`}>
                          <Button variant="outline">Edit</Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

