export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      app_roles: {
        Row: {
          created_at: string | null
          id: number
          role_name: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          role_name: string
        }
        Update: {
          created_at?: string | null
          id?: never
          role_name?: string
        }
        Relationships: []
      }
      coffee_equipments: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          type: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          type: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coffee_equipments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coffee_grinders: {
        Row: {
          active: boolean
          created_at: string
          id: string
          manufacturer: string | null
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          manufacturer?: string | null
          name: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          manufacturer?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coffee_grinders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coffee_machines: {
        Row: {
          active: boolean
          created_at: string
          id: string
          manufacturer: string | null
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          manufacturer?: string | null
          name: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          manufacturer?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coffee_machines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coffee_targets: {
        Row: {
          coffee_id: string
          created_at: string
          id: string
          max_extraction_time: number | null
          max_flow_rate: number | null
          max_preinfusion_time: number | null
          max_yield: number | null
          min_extraction_time: number | null
          min_flow_rate: number | null
          min_preinfusion_time: number | null
          min_yield: number | null
          taste_profile: string
        }
        Insert: {
          coffee_id: string
          created_at?: string
          id?: string
          max_extraction_time?: number | null
          max_flow_rate?: number | null
          max_preinfusion_time?: number | null
          max_yield?: number | null
          min_extraction_time?: number | null
          min_flow_rate?: number | null
          min_preinfusion_time?: number | null
          min_yield?: number | null
          taste_profile?: string
        }
        Update: {
          coffee_id?: string
          created_at?: string
          id?: string
          max_extraction_time?: number | null
          max_flow_rate?: number | null
          max_preinfusion_time?: number | null
          max_yield?: number | null
          min_extraction_time?: number | null
          min_flow_rate?: number | null
          min_preinfusion_time?: number | null
          min_yield?: number | null
          taste_profile?: string
        }
        Relationships: [
          {
            foreignKeyName: "coffee_targets_coffee_id_fkey"
            columns: ["coffee_id"]
            isOneToOne: false
            referencedRelation: "coffees"
            referencedColumns: ["id"]
          },
        ]
      }
      coffees: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          notes: string | null
          price_per_kg: number | null
          roast_profile: string | null
          roaster: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          notes?: string | null
          price_per_kg?: number | null
          roast_profile?: string | null
          roaster?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          notes?: string | null
          price_per_kg?: number | null
          roast_profile?: string | null
          roaster?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coffees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      espresso_readings: {
        Row: {
          coffee_id: string | null
          coffee_mass_in: number
          comments: string
          created_at: string
          extraction_time: number
          flavour_balance: number
          flow_rate: number
          id: string
          preinfusion_time: number
          rating: number
          setup_id: string | null
          total_yield: number
          user_id: string
          warming_shot: boolean
          workflow_id: string | null
        }
        Insert: {
          coffee_id?: string | null
          coffee_mass_in: number
          comments?: string
          created_at?: string
          extraction_time?: number
          flavour_balance: number
          flow_rate: number
          id?: string
          preinfusion_time?: number
          rating?: number
          setup_id?: string | null
          total_yield: number
          user_id: string
          warming_shot?: boolean
          workflow_id?: string | null
        }
        Update: {
          coffee_id?: string | null
          coffee_mass_in?: number
          comments?: string
          created_at?: string
          extraction_time?: number
          flavour_balance?: number
          flow_rate?: number
          id?: string
          preinfusion_time?: number
          rating?: number
          setup_id?: string | null
          total_yield?: number
          user_id?: string
          warming_shot?: boolean
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "espresso_readings_coffee_id_fkey"
            columns: ["coffee_id"]
            isOneToOne: false
            referencedRelation: "coffees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "espresso_readings_setup_id_fkey"
            columns: ["setup_id"]
            isOneToOne: false
            referencedRelation: "setups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "espresso_readings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "espresso_readings_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_banned: boolean
          privacy_policy_accepted_at: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_banned?: boolean
          privacy_policy_accepted_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_banned?: boolean
          privacy_policy_accepted_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      setup_equipments: {
        Row: {
          equipment_id: string
          setup_id: string
        }
        Insert: {
          equipment_id: string
          setup_id: string
        }
        Update: {
          equipment_id?: string
          setup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setup_equipments_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "coffee_equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setup_equipments_setup_id_fkey"
            columns: ["setup_id"]
            isOneToOne: false
            referencedRelation: "setups"
            referencedColumns: ["id"]
          },
        ]
      }
      setups: {
        Row: {
          active: boolean
          created_at: string
          grinder_id: string | null
          id: string
          machine_id: string | null
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          grinder_id?: string | null
          id?: string
          machine_id?: string | null
          name: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          grinder_id?: string | null
          id?: string
          machine_id?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setups_grinder_id_fkey"
            columns: ["grinder_id"]
            isOneToOne: false
            referencedRelation: "coffee_grinders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setups_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "coffee_machines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: number
          role_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          role_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "app_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          created_at: string
          id: string
          important: boolean
          instructions: string | null
          stage: string
          step_number: number
          title: string | null
          workflow_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          important?: boolean
          instructions?: string | null
          stage: string
          step_number: number
          title?: string | null
          workflow_id: string
        }
        Update: {
          created_at?: string
          id?: string
          important?: boolean
          instructions?: string | null
          stage?: string
          step_number?: number
          title?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize: { Args: { requested_role: string }; Returns: boolean }
      delete_user_permanently: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_moderator: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

