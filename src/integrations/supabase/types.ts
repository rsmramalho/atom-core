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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      items: {
        Row: {
          checklist: Json | null
          completed: boolean
          completed_at: string | null
          completion_log: Json | null
          created_at: string
          deadline: string | null
          due_date: string | null
          id: string
          milestones: Json | null
          module: string | null
          notes: string | null
          order_index: number | null
          parent_id: string | null
          progress: number | null
          progress_mode: Database["public"]["Enums"]["progress_mode"] | null
          project_id: string | null
          project_status: Database["public"]["Enums"]["project_status"] | null
          recurrence_rule: string | null
          ritual_slot: Database["public"]["Enums"]["ritual_slot"] | null
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          checklist?: Json | null
          completed?: boolean
          completed_at?: string | null
          completion_log?: Json | null
          created_at?: string
          deadline?: string | null
          due_date?: string | null
          id?: string
          milestones?: Json | null
          module?: string | null
          notes?: string | null
          order_index?: number | null
          parent_id?: string | null
          progress?: number | null
          progress_mode?: Database["public"]["Enums"]["progress_mode"] | null
          project_id?: string | null
          project_status?: Database["public"]["Enums"]["project_status"] | null
          recurrence_rule?: string | null
          ritual_slot?: Database["public"]["Enums"]["ritual_slot"] | null
          tags?: string[] | null
          title: string
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          checklist?: Json | null
          completed?: boolean
          completed_at?: string | null
          completion_log?: Json | null
          created_at?: string
          deadline?: string | null
          due_date?: string | null
          id?: string
          milestones?: Json | null
          module?: string | null
          notes?: string | null
          order_index?: number | null
          parent_id?: string | null
          progress?: number | null
          progress_mode?: Database["public"]["Enums"]["progress_mode"] | null
          project_id?: string | null
          project_status?: Database["public"]["Enums"]["project_status"] | null
          recurrence_rule?: string | null
          ritual_slot?: Database["public"]["Enums"]["ritual_slot"] | null
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          checklist_progress: Json
          created_at: string
          has_completed_tour: boolean
          has_completed_welcome: boolean
          id: string
          show_checklist: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist_progress?: Json
          created_at?: string
          has_completed_tour?: boolean
          has_completed_welcome?: boolean
          id?: string
          show_checklist?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist_progress?: Json
          created_at?: string
          has_completed_tour?: boolean
          has_completed_welcome?: boolean
          id?: string
          show_checklist?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      project_activities: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json | null
          project_id: string
          target_title: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id: string
          target_title?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id?: string
          target_title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      project_invites: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string
          id: string
          invite_code: string
          max_uses: number | null
          project_id: string
          role: Database["public"]["Enums"]["member_role"]
          use_count: number
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string
          id?: string
          invite_code?: string
          max_uses?: number | null
          project_id: string
          role?: Database["public"]["Enums"]["member_role"]
          use_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          invite_code?: string
          max_uses?: number | null
          project_id?: string
          role?: Database["public"]["Enums"]["member_role"]
          use_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_invites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string
          id: string
          project_id: string
          role: Database["public"]["Enums"]["member_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          role?: Database["public"]["Enums"]["member_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_project_invite: { Args: { _invite_code: string }; Returns: string }
      ensure_project_owner: {
        Args: { _project_id: string }
        Returns: undefined
      }
      is_project_co_member: {
        Args: { _target_id: string; _viewer_id: string }
        Returns: boolean
      }
      is_project_creator: {
        Args: { _project_id: string; _user_id: string }
        Returns: boolean
      }
      is_project_editor: {
        Args: { _project_id: string; _user_id: string }
        Returns: boolean
      }
      is_project_member: {
        Args: { _project_id: string; _user_id: string }
        Returns: boolean
      }
      is_project_owner: {
        Args: { _project_id: string; _user_id: string }
        Returns: boolean
      }
      log_project_activity: {
        Args: {
          _action: string
          _metadata?: Json
          _project_id: string
          _target_title?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      item_type:
        | "project"
        | "task"
        | "habit"
        | "note"
        | "reflection"
        | "resource"
        | "list"
      member_role: "owner" | "editor" | "viewer"
      progress_mode: "auto" | "manual" | "milestone"
      project_status: "draft" | "active" | "paused" | "completed" | "archived"
      ritual_slot: "manha" | "meio_dia" | "noite"
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
      item_type: [
        "project",
        "task",
        "habit",
        "note",
        "reflection",
        "resource",
        "list",
      ],
      member_role: ["owner", "editor", "viewer"],
      progress_mode: ["auto", "manual", "milestone"],
      project_status: ["draft", "active", "paused", "completed", "archived"],
      ritual_slot: ["manha", "meio_dia", "noite"],
    },
  },
} as const
