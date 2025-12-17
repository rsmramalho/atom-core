// Auth types for MindMate
// Based on Supabase Auth User structure

export interface UserProfile {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string | null;
  phone: string;
  confirmed_at: string | null;
  last_sign_in_at: string | null;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  identities: Array<{
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: Record<string, unknown>;
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
  }>;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

// Simplified User type for component state
// Uses Supabase's User type structure
import type { User } from '@supabase/supabase-js';
export type { User };

// Auth error type for error handling
export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}
