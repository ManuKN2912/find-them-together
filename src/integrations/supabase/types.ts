export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      case_photos: {
        Row: {
          case_id: string
          created_at: string
          id: string
          position: number | null
          storage_path: string | null
          url: string
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          position?: number | null
          storage_path?: string | null
          url: string
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          position?: number | null
          storage_path?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_photos_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          age: number | null
          ai_status: string | null
          birthmarks: string | null
          body_shape: string | null
          city: string | null
          clothes_last_worn: string | null
          contact_alt_phone: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          cover_photo_url: string | null
          created_at: string
          date_missing: string | null
          description: string | null
          eye_color: string | null
          fir_verified: boolean | null
          full_name: string
          gender: string | null
          hair: string | null
          height_cm: number | null
          id: string
          last_seen_location: string | null
          lat: number | null
          lng: number | null
          other_marks: string | null
          preferred_channels: string[] | null
          reporter_id: string
          reward: number | null
          scars: string | null
          skin_tone: string | null
          state: string | null
          status: Database["public"]["Enums"]["case_status"]
          tattoos: string | null
          time_missing: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          ai_status?: string | null
          birthmarks?: string | null
          body_shape?: string | null
          city?: string | null
          clothes_last_worn?: string | null
          contact_alt_phone?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          cover_photo_url?: string | null
          created_at?: string
          date_missing?: string | null
          description?: string | null
          eye_color?: string | null
          fir_verified?: boolean | null
          full_name: string
          gender?: string | null
          hair?: string | null
          height_cm?: number | null
          id?: string
          last_seen_location?: string | null
          lat?: number | null
          lng?: number | null
          other_marks?: string | null
          preferred_channels?: string[] | null
          reporter_id: string
          reward?: number | null
          scars?: string | null
          skin_tone?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["case_status"]
          tattoos?: string | null
          time_missing?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          ai_status?: string | null
          birthmarks?: string | null
          body_shape?: string | null
          city?: string | null
          clothes_last_worn?: string | null
          contact_alt_phone?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          cover_photo_url?: string | null
          created_at?: string
          date_missing?: string | null
          description?: string | null
          eye_color?: string | null
          fir_verified?: boolean | null
          full_name?: string
          gender?: string | null
          hair?: string | null
          height_cm?: number | null
          id?: string
          last_seen_location?: string | null
          lat?: number | null
          lng?: number | null
          other_marks?: string | null
          preferred_channels?: string[] | null
          reporter_id?: string
          reward?: number | null
          scars?: string | null
          skin_tone?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["case_status"]
          tattoos?: string | null
          time_missing?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string | null
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string | null
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string | null
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sightings: {
        Row: {
          ai_confidence: number | null
          ai_result: string | null
          case_id: string
          created_at: string
          id: string
          location: string | null
          notes: string | null
          photo_url: string | null
          reporter_id: string
          status: Database["public"]["Enums"]["sighting_status"]
          storage_path: string | null
        }
        Insert: {
          ai_confidence?: number | null
          ai_result?: string | null
          case_id: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          photo_url?: string | null
          reporter_id: string
          status?: Database["public"]["Enums"]["sighting_status"]
          storage_path?: string | null
        }
        Update: {
          ai_confidence?: number | null
          ai_result?: string | null
          case_id?: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          photo_url?: string | null
          reporter_id?: string
          status?: Database["public"]["Enums"]["sighting_status"]
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sightings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      case_status: "active" | "found" | "closed" | "pending_review"
      sighting_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      case_status: ["active", "found", "closed", "pending_review"],
      sighting_status: ["pending", "verified", "rejected"],
    },
  },
} as const
