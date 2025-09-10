// Temporary shim if your editor still can't "see" Session from supabase-js v2.
// Remove this file once step A is fixed and the official type imports cleanly.
declare module '@supabase/supabase-js' {
  export interface UserIdentity {
    identity_id: string;
    provider: string;
    identity_data: Record<string, any> | null;
    last_sign_in_at: string | null;
    created_at: string | null;
    updated_at: string | null;
  }

  export interface UserAppMetadata {
    provider?: string;
    providers?: string[];
    [k: string]: any;
  }

  export interface User {
    id: string;
    email?: string;
    phone?: string;
    app_metadata: UserAppMetadata;
    user_metadata: Record<string, any>;
    identities?: UserIdentity[];
    created_at: string;
    updated_at: string;
    role?: string;
    aud?: string;
  }

  export interface Session {
    access_token: string;
    token_type: 'bearer';
    expires_in: number;
    expires_at?: number;
    refresh_token: string;
    user: User;
  }
}
