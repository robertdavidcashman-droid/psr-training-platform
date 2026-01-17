export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          role: 'user' | 'supervisor' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          role?: 'user' | 'supervisor' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          role?: 'user' | 'supervisor' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      syllabus_topics: {
        Row: {
          id: string;
          code: string;
          title: string;
          description: string | null;
          parent_id: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          description?: string | null;
          parent_id?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          title?: string;
          description?: string | null;
          parent_id?: string | null;
        };
      };
      competencies: {
        Row: {
          id: string;
          code: string;
          title: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          title?: string;
          description?: string | null;
        };
      };
      topic_competency_map: {
        Row: {
          topic_id: string;
          competency_id: string;
        };
        Insert: {
          topic_id: string;
          competency_id: string;
        };
        Update: {
          topic_id?: string;
          competency_id?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          type: 'mcq' | 'sba' | 'truefalse' | 'short' | 'scenario';
          prompt: string;
          explanation: string | null;
          difficulty: number;
          status: 'draft' | 'published';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: 'mcq' | 'sba' | 'truefalse' | 'short' | 'scenario';
          prompt: string;
          explanation?: string | null;
          difficulty: number;
          status?: 'draft' | 'published';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'mcq' | 'sba' | 'truefalse' | 'short' | 'scenario';
          prompt?: string;
          explanation?: string | null;
          difficulty?: number;
          status?: 'draft' | 'published';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      question_options: {
        Row: {
          id: number;
          question_id: string;
          label: string | null;
          text: string;
          is_correct: boolean;
        };
        Insert: {
          id?: number;
          question_id: string;
          label?: string | null;
          text: string;
          is_correct?: boolean;
        };
        Update: {
          id?: number;
          question_id?: string;
          label?: string | null;
          text?: string;
          is_correct?: boolean;
        };
      };
      question_tags: {
        Row: {
          question_id: string;
          topic_id: string | null;
          competency_id: string | null;
        };
        Insert: {
          question_id: string;
          topic_id?: string | null;
          competency_id?: string | null;
        };
        Update: {
          question_id?: string;
          topic_id?: string | null;
          competency_id?: string | null;
        };
      };
      quizzes: {
        Row: {
          id: string;
          title: string;
          mode: 'daily' | 'topic' | 'mock';
          settings: Json;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          mode: 'daily' | 'topic' | 'mock';
          settings?: Json;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          mode?: 'daily' | 'topic' | 'mock';
          settings?: Json;
          created_by?: string | null;
          created_at?: string;
        };
      };
      quiz_items: {
        Row: {
          quiz_id: string;
          question_id: string;
          order: number;
        };
        Insert: {
          quiz_id: string;
          question_id: string;
          order: number;
        };
        Update: {
          quiz_id?: string;
          question_id?: string;
          order?: number;
        };
      };
      attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string | null;
          started_at: string;
          completed_at: string | null;
          score: number | null;
          xp_earned: number;
          duration_seconds: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id?: string | null;
          started_at?: string;
          completed_at?: string | null;
          score?: number | null;
          xp_earned?: number;
          duration_seconds?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string | null;
          started_at?: string;
          completed_at?: string | null;
          score?: number | null;
          xp_earned?: number;
          duration_seconds?: number | null;
        };
      };
      attempt_items: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          selected_option_ids: Json | null;
          is_correct: boolean | null;
          time_spent_seconds: number | null;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          selected_option_ids?: Json | null;
          is_correct?: boolean | null;
          time_spent_seconds?: number | null;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          question_id?: string;
          selected_option_ids?: Json | null;
          is_correct?: boolean | null;
          time_spent_seconds?: number | null;
        };
      };
      review_queue: {
        Row: {
          user_id: string;
          question_id: string;
          next_due_at: string;
          interval_days: number;
          ease_factor: number;
          last_result: string | null;
        };
        Insert: {
          user_id: string;
          question_id: string;
          next_due_at: string;
          interval_days?: number;
          ease_factor?: number;
          last_result?: string | null;
        };
        Update: {
          user_id?: string;
          question_id?: string;
          next_due_at?: string;
          interval_days?: number;
          ease_factor?: number;
          last_result?: string | null;
        };
      };
      scenarios: {
        Row: {
          id: string;
          title: string;
          brief: string | null;
          difficulty: number;
          status: 'draft' | 'published';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          brief?: string | null;
          difficulty: number;
          status?: 'draft' | 'published';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          brief?: string | null;
          difficulty?: number;
          status?: 'draft' | 'published';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      scenario_steps: {
        Row: {
          id: string;
          scenario_id: string;
          step_order: number;
          content: string;
          step_type: 'info' | 'question' | 'decision';
          payload: Json;
        };
        Insert: {
          id?: string;
          scenario_id: string;
          step_order: number;
          content: string;
          step_type: 'info' | 'question' | 'decision';
          payload?: Json;
        };
        Update: {
          id?: string;
          scenario_id?: string;
          step_order?: number;
          content?: string;
          step_type?: 'info' | 'question' | 'decision';
          payload?: Json;
        };
      };
      scenario_attempts: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string;
          started_at: string;
          completed_at: string | null;
          score: number | null;
          notes: string | null;
          responses: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_id: string;
          started_at?: string;
          completed_at?: string | null;
          score?: number | null;
          notes?: string | null;
          responses?: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          scenario_id?: string;
          started_at?: string;
          completed_at?: string | null;
          score?: number | null;
          notes?: string | null;
          responses?: Json;
        };
      };
      portfolio_cases: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          case_type: string | null;
          created_at: string;
          updated_at: string;
          status: 'draft' | 'ready' | 'shared' | 'signedoff';
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          case_type?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: 'draft' | 'ready' | 'shared' | 'signedoff';
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          case_type?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: 'draft' | 'ready' | 'shared' | 'signedoff';
        };
      };
      portfolio_entries: {
        Row: {
          id: string;
          case_id: string;
          section_key: string;
          content: Json | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          section_key: string;
          content?: Json | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          section_key?: string;
          content?: Json | null;
          updated_at?: string;
        };
      };
      portfolio_reflections: {
        Row: {
          id: string;
          case_id: string;
          prompt_key: string;
          response: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          prompt_key: string;
          response?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          prompt_key?: string;
          response?: string | null;
          updated_at?: string;
        };
      };
      supervisor_links: {
        Row: {
          id: string;
          supervisee_user_id: string;
          supervisor_user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          supervisee_user_id: string;
          supervisor_user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          supervisee_user_id?: string;
          supervisor_user_id?: string;
          created_at?: string;
        };
      };
      supervisor_signoffs: {
        Row: {
          id: string;
          case_id: string;
          supervisor_user_id: string;
          signed_at: string;
          comments: string | null;
        };
        Insert: {
          id?: string;
          case_id: string;
          supervisor_user_id: string;
          signed_at?: string;
          comments?: string | null;
        };
        Update: {
          id?: string;
          case_id?: string;
          supervisor_user_id?: string;
          signed_at?: string;
          comments?: string | null;
        };
      };
      audit_events: {
        Row: {
          id: string;
          actor_user_id: string;
          action: string;
          entity: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_user_id: string;
          action: string;
          entity: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_user_id?: string;
          action?: string;
          entity?: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
