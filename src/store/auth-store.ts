
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'default' | 'car' | 'onepiece' | 'robotic' | 'mathematics' | 'moana' | 'flower';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  department?: string;
  semester?: number;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  theme: ThemeType;
  darkMode: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleDarkMode: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      theme: 'default',
      darkMode: false,
      setTheme: (theme) => set({ theme }),
      toggleDarkMode: () => set((state) => {
        const newDarkMode = !state.darkMode;
        document.documentElement.classList.toggle('dark', newDarkMode);
        return { darkMode: newDarkMode };
      }),
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        role: user.role,
      }),
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: null,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

