export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  specialization?: string; // for doctors
  department?: string;
  phone?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  specialization?: string;
  department?: string;
  phone?: string;
}