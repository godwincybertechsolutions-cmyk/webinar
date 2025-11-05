export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: "host" | "attendee";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: "host" | "attendee";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          role?: "host" | "attendee";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      webinars: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description: string | null;
          thumbnail_url: string | null;
          scheduled_at: string;
          duration_minutes: number;
          status: "upcoming" | "live" | "completed" | "cancelled";
          room_name: string;
          max_participants: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          description?: string | null;
          thumbnail_url?: string | null;
          scheduled_at: string;
          duration_minutes?: number;
          status?: "upcoming" | "live" | "completed" | "cancelled";
          room_name: string;
          max_participants?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_id?: string;
          title?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          scheduled_at?: string;
          duration_minutes?: number;
          status?: "upcoming" | "live" | "completed" | "cancelled";
          room_name?: string;
          max_participants?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

