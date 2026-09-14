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
      gifts: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_given: boolean
          name: string
          owner_id: string
          price: number
          updated_at: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_given?: boolean
          name: string
          owner_id: string
          price: number
          updated_at?: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_given?: boolean
          name?: string
          owner_id?: string
          price?: number
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gifts_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string
          id: string
          name: string
          normalized_name: string
          owner_id: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          normalized_name: string
          owner_id: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          normalized_name?: string
          owner_id?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          attending: boolean
          child_names: string[]
          children_count: number
          created_at: string
          guest_count: number
          guest_names: string[]
          helper_names: string[]
          helpers_count: number
          id: string
          name: string
          on_list: boolean
          owner_id: string
          updated_at: string
          wedding_id: string
          whatsapp: string
        }
        Insert: {
          attending: boolean
          child_names?: string[]
          children_count?: number
          created_at?: string
          guest_count?: number
          guest_names?: string[]
          helper_names?: string[]
          helpers_count?: number
          id?: string
          name: string
          on_list?: boolean
          owner_id: string
          updated_at?: string
          wedding_id: string
          whatsapp?: string
        }
        Update: {
          attending?: boolean
          child_names?: string[]
          children_count?: number
          created_at?: string
          guest_count?: number
          guest_names?: string[]
          helper_names?: string[]
          helpers_count?: number
          id?: string
          name?: string
          on_list?: boolean
          owner_id?: string
          updated_at?: string
          wedding_id?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
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
      weddings: {
        Row: {
          ceremony: Json
          couple_names: string
          cover_photo: string
          created_at: string
          date_text: string
          id: string
          is_published: boolean
          owner_id: string
          partner_one_name: string
          partner_one_role: string
          partner_two_name: string
          partner_two_role: string
          pix: Json
          reception: Json
          setup_completed: boolean
          slug: string
          story: string
          theme: Json
          total_guests: number
          updated_at: string
          wedding_at: string
          whatsapp: string
        }
        Insert: {
          ceremony?: Json
          couple_names?: string
          cover_photo?: string
          created_at?: string
          date_text?: string
          id?: string
          is_published?: boolean
          owner_id: string
          partner_one_name?: string
          partner_one_role?: string
          partner_two_name?: string
          partner_two_role?: string
          pix?: Json
          reception?: Json
          setup_completed?: boolean
          slug: string
          story?: string
          theme?: Json
          total_guests?: number
          updated_at?: string
          wedding_at?: string
          whatsapp?: string
        }
        Update: {
          ceremony?: Json
          couple_names?: string
          cover_photo?: string
          created_at?: string
          date_text?: string
          id?: string
          is_published?: boolean
          owner_id?: string
          partner_one_name?: string
          partner_one_role?: string
          partner_two_name?: string
          partner_two_role?: string
          pix?: Json
          reception?: Json
          setup_completed?: boolean
          slug?: string
          story?: string
          theme?: Json
          total_guests?: number
          updated_at?: string
          wedding_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_guest_name: {
        Args: { candidate: string; target_wedding: string }
        Returns: boolean
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
    },
  },
} as const
