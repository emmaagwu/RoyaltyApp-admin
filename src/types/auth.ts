export type AdminRole = 'member'|'SUPER_ADMIN' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  role?: AdminRole;
  profile_image_url?: string;
  home_address?: string;
  marital_status?: string;
  created_at: string;
  updated_at?: string;
  phone_number?: string;
}