export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          question_text: string;
          category: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          options: Record<string, any>;
          correct_answer: string[];
          explanation: string | null;
          source_refs: string[] | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
          approved_by: string | null;
          approved_at: string | null;
        };
        Insert: {
          id?: string;
          question_text: string;
          category: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          options: Record<string, any>;
          correct_answer: string[];
          explanation?: string | null;
          source_refs?: string[] | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
        };
        Update: {
          id?: string;
          question_text?: string;
          category?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          options?: Record<string, any>;
          correct_answer?: string[];
          explanation?: string | null;
          source_refs?: string[] | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          answered_correctly: boolean;
          selected_answer: string[] | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          answered_correctly: boolean;
          selected_answer?: string[] | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          answered_correctly?: boolean;
          selected_answer?: string[] | null;
          timestamp?: string;
        };
      };
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          login_time: string;
          logout_time: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          login_time: string;
          logout_time?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          login_time?: string;
          logout_time?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      user_activity_log: {
        Row: {
          id: string;
          user_id: string;
          session_id: string | null;
          action_type: string;
          action_details: Record<string, any>;
          page_url: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id?: string | null;
          action_type: string;
          action_details?: Record<string, any>;
          page_url?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string | null;
          action_type?: string;
          action_details?: Record<string, any>;
          page_url?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      content_modules: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: string;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      scenario_sessions: {
        Row: {
          id: string;
          user_id: string;
          scenario_data: Record<string, any>;
          responses: Record<string, any>;
          feedback: Record<string, any> | null;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_data: Record<string, any>;
          responses?: Record<string, any>;
          feedback?: Record<string, any> | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          scenario_data?: Record<string, any>;
          responses?: Record<string, any>;
          feedback?: Record<string, any> | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          module_id: string | null;
          certificate_url: string | null;
          issued_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id?: string | null;
          certificate_url?: string | null;
          issued_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string | null;
          certificate_url?: string | null;
          issued_at?: string;
        };
      };
      imported_sources: {
        Row: {
          id: string;
          title: string;
          content: string;
          source_type: 'pace_code' | 'book' | 'case_law' | 'other';
          imported_at: string;
          parsed_content: Record<string, any> | null;
          metadata: Record<string, any> | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          source_type: 'pace_code' | 'book' | 'case_law' | 'other';
          imported_at?: string;
          parsed_content?: Record<string, any> | null;
          metadata?: Record<string, any> | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          source_type?: 'pace_code' | 'book' | 'case_law' | 'other';
          imported_at?: string;
          parsed_content?: Record<string, any> | null;
          metadata?: Record<string, any> | null;
        };
      };
      ai_generated_questions: {
        Row: {
          id: string;
          source_id: string | null;
          question_data: Record<string, any>;
          status: 'pending' | 'approved' | 'rejected' | 'reviewed';
          review_notes: string | null;
          created_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          source_id?: string | null;
          question_data: Record<string, any>;
          status?: 'pending' | 'approved' | 'rejected' | 'reviewed';
          review_notes?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          source_id?: string | null;
          question_data?: Record<string, any>;
          status?: 'pending' | 'approved' | 'rejected' | 'reviewed';
          review_notes?: string | null;
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
      };
    };
  };
};


























