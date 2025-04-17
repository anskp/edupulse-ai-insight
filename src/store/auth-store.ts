
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'teacher' | 'student' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true,
        role: user.role 
      }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        role: null 
      }),
      updateUser: (updatedUser) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedUser } : null
      })),
    }),
    {
      name: 'edupulse-auth',
    }
  )
);
