
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'default' | 'car' | 'onepiece' | 'robotic' | 'mathematics' | 'moana' | 'flower';
export type UserRole = 'admin' | 'teacher' | 'student';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  semester?: number;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  theme: ThemeType;
  darkMode: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleDarkMode: () => void;
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
      theme: 'default',
      darkMode: false,
      setTheme: (theme) => {
        // Remove all theme classes and add the new one
        document.documentElement.classList.remove('default', 'car', 'onepiece', 'robotic', 'mathematics', 'moana', 'flower');
        if (theme !== 'default') {
          document.documentElement.classList.add(theme);
        }
        // Ensure dark mode state is maintained when changing themes
        const state = useAuthStore.getState();
        if (state.darkMode) {
          document.documentElement.classList.add('dark');
        }
        set({ theme });
      },
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
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
