export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  ci?: string;
  address?: string;
}

export interface AuthResponse {
  access_token?: string;
  requires2FA?: boolean;
  email?: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isVerified: boolean;
  twoFactorEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}
