"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditWebinarPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = typeof params === 'object' && 'then' in params ? { id: '' } : params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduled_at: "",
    duration_minutes: 60,
    max_participants: 100,
    thumbnail_url: "",
  });

  const loadWebinar = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("webinars")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        description: data.description || "",
        scheduled_at: new Date(data.scheduled_at).toISOString().slice(0, 16),
        duration_minutes: data.duration_minutes,
        max_participants: data.max_participants,
        thumbnail_url: data.thumbnail_url || "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to load webinar");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    if (resolvedParams.id) {
      loadWebinar();
    }
  }, [resolvedParams.id, loadWebinar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("webinars")
        .update({
          title: formData.title,
          description: formData.description,
          scheduled_at: formData.scheduled_at,
          duration_minutes: formData.duration_minutes,
          max_participants: formData.max_participants,
          thumbnail_url: formData.thumbnail_url || null,
        })
        .eq("id", resolvedParams.id);

      if (error) throw error;

      toast.success("Webinar updated successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to update webinar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this webinar?")) return;

    try {
      const { error } = await supabase
        .from("webinars")
        .delete()
        .eq("id", resolvedParams.id);

      if (error) throw error;

      toast.success("Webinar deleted successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete webinar");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Webinar</CardTitle>
            <CardDescription>Update your webinar details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Webinar Title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your webinar..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scheduled Date & Time *</label>
                <Input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })
                    }
                    min={15}
                    max={480}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Participants</label>
                  <Input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) =>
                      setFormData({ ...formData, max_participants: parseInt(e.target.value) })
                    }
                    min={1}
                    max={1000}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail URL (optional)</label>
                <Input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1"
                >
                  Delete
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

