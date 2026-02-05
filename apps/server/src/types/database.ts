export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          nickname: string | null;
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          nickname?: string | null;
          avatar?: string | null;
        };
        Update: {
          email?: string;
          password?: string;
          nickname?: string | null;
          avatar?: string | null;
        };
        Relationships: [];
      };
      provider_configs: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          api_key: string;
          base_url: string | null;
          default_model: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          api_key: string;
          base_url?: string | null;
          default_model?: string | null;
          is_active?: boolean;
        };
        Update: {
          user_id?: string;
          provider?: string;
          api_key?: string;
          base_url?: string | null;
          default_model?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          mode: string;
          provider: string;
          model: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          mode?: string;
          provider: string;
          model: string;
        };
        Update: {
          title?: string;
          mode?: string;
          provider?: string;
          model?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          session_id: string;
          role: string;
          content: string;
          token_count: number | null;
          response_time: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: string;
          content: string;
          token_count?: number | null;
          response_time?: number | null;
        };
        Update: {
          content?: string;
          token_count?: number | null;
          response_time?: number | null;
        };
        Relationships: [];
      };
      usage_stats: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          model: string;
          request_count: number;
          token_input: number;
          token_output: number;
          date: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          model: string;
          request_count?: number;
          token_input?: number;
          token_output?: number;
          date: string;
        };
        Update: {
          request_count?: number;
          token_input?: number;
          token_output?: number;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
