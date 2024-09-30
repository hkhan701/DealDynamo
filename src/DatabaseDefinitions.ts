export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contact_requests: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          message_body: string | null
          phone: string | null
          updated_at: Date | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message_body?: string | null
          phone?: string | null
          updated_at?: Date | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message_body?: string | null
          phone?: string | null
          updated_at?: Date | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: Date | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          user_id: string
          running_status: boolean
          country: string,
          minimum_savings_threshold: number
          cleanup_days_threshold: number
          maximum_posts_per_session: number
          delay_between_posts: number
          delay_between_sessions: number
          recently_updated_hour_threshold: number
          special_message_threshold: number
          random_image_toggle: boolean
          deeplink_toggle: boolean
          associate_tag: string
          start_time: string
          end_time: string
          fb_group_link: string
          fb_page_id: string
          logins: Json
          access_token: string
          first_line_message: string
          bottom_line_message: string
          custom_template: string
          updated_at: Date | null
        }
        Insert: {
          user_id: string
          running_status?: boolean
          country?: string
          minimum_savings_threshold?: number
          cleanup_days_threshold?: number
          maximum_posts_per_session?: number
          delay_between_posts?: number
          delay_between_sessions?: number
          recently_updated_hour_threshold?: number
          special_message_threshold?: number
          random_image_toggle?: boolean
          deeplink_toggle?: boolean
          associate_tag?: string
          start_time?: string
          end_time?: string
          fb_group_link?: string
          fb_page_id?: string
          logins?: Json
          access_token?: string
          first_line_message?: string
          bottom_line_message?: string
          custom_template?: string
          updated_at?: Date | null
        }
        Update: {
          user_id?: string
          running_status?: boolean
          country?: string
          minimum_savings_threshold?: number
          cleanup_days_threshold?: number
          maximum_posts_per_session?: number
          delay_between_posts?: number
          delay_between_sessions?: number
          recently_updated_hour_threshold?: number
          special_message_threshold?: number
          random_image_toggle?: boolean
          deeplink_toggle?: boolean
          associate_tag?: string
          start_time?: string
          end_time?: string
          fb_group_link?: string
          fb_page_id?: string
          logins?: Json
          access_token?: string
          first_line_message?: string
          bottom_line_message?: string
          custom_template?: string
          updated_at?: Date | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
