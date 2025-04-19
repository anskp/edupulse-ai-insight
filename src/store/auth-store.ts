
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'default' | 'car' | 'onepiece' | 'robotic' | 'mathematics' | 'moana' | 'flower';

export type UserRole = 'admin' | 'teacher' | 'student' | 'guest';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  theme: ThemeType;
  loggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  setTheme: (theme: ThemeType) => void;
  applyThemeEffects: (theme: ThemeType) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      theme: 'default',
      loggedIn: false,
      login: (user) => set({ user, loggedIn: true }),
      logout: () => set({ user: null, loggedIn: false }),
      setTheme: (theme) => {
        set({ theme });
        get().applyThemeEffects(theme);
      },
      applyThemeEffects: (theme) => {
        const root = document.documentElement;
        
        // Remove existing theme classes
        root.classList.remove(
          'theme-default',
          'theme-car',
          'theme-onepiece',
          'theme-robotic',
          'theme-mathematics',
          'theme-moana',
          'theme-flower'
        );
        
        // Add the selected theme class
        root.classList.add(`theme-${theme}`);
        
        // Apply specific theme effects
        switch (theme) {
          case 'car':
            // Racing theme with blues and dynamic elements
            root.style.setProperty('--primary', 'hsl(220, 80%, 50%)');
            root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--secondary', 'hsl(200, 70%, 55%)');
            root.style.setProperty('--accent', 'hsl(340, 90%, 55%)');
            root.style.setProperty('--muted', 'hsl(210, 30%, 25%)');
            break;
          case 'onepiece':
            // Pirate theme with reds and yellows
            root.style.setProperty('--primary', 'hsl(0, 80%, 50%)');
            root.style.setProperty('--primary-foreground', 'hsl(40, 80%, 90%)');
            root.style.setProperty('--secondary', 'hsl(40, 90%, 50%)');
            root.style.setProperty('--accent', 'hsl(220, 70%, 50%)');
            root.style.setProperty('--muted', 'hsl(20, 30%, 25%)');
            break;
          case 'robotic':
            // Futuristic theme with dark backgrounds and neon accents
            root.style.setProperty('--primary', 'hsl(120, 90%, 50%)');
            root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 0%)');
            root.style.setProperty('--secondary', 'hsl(220, 90%, 60%)');
            root.style.setProperty('--accent', 'hsl(300, 90%, 50%)');
            root.style.setProperty('--muted', 'hsl(240, 15%, 15%)');
            break;
          case 'mathematics':
            // Clean, precise theme with greens
            root.style.setProperty('--primary', 'hsl(120, 60%, 40%)');
            root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--secondary', 'hsl(180, 60%, 40%)');
            root.style.setProperty('--accent', 'hsl(90, 60%, 40%)');
            root.style.setProperty('--muted', 'hsl(120, 15%, 20%)');
            break;
          case 'moana':
            // Ocean-inspired theme with blues and teals
            root.style.setProperty('--primary', 'hsl(200, 80%, 50%)');
            root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--secondary', 'hsl(180, 70%, 50%)');
            root.style.setProperty('--accent', 'hsl(20, 90%, 60%)');
            root.style.setProperty('--muted', 'hsl(200, 30%, 20%)');
            break;
          case 'flower':
            // Floral theme with pinks and soft colors
            root.style.setProperty('--primary', 'hsl(330, 70%, 60%)');
            root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--secondary', 'hsl(280, 60%, 70%)');
            root.style.setProperty('--accent', 'hsl(20, 80%, 80%)');
            root.style.setProperty('--muted', 'hsl(330, 20%, 25%)');
            break;
          default:
            // Default educational theme
            root.style.setProperty('--primary', '');
            root.style.setProperty('--primary-foreground', '');
            root.style.setProperty('--secondary', '');
            root.style.setProperty('--accent', '');
            root.style.setProperty('--muted', '');
            break;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, theme: state.theme, loggedIn: state.loggedIn }),
      onRehydrateStorage: (state) => {
        return (rehydratedState, error) => {
          if (error) {
            console.error('Error rehydrating auth state:', error);
          } else if (rehydratedState) {
            // Apply theme effects after rehydration
            rehydratedState.applyThemeEffects(rehydratedState.theme);
          }
        };
      },
    }
  )
);

// Initialize theme on app load
if (typeof window !== 'undefined') {
  const storedState = JSON.parse(localStorage.getItem('auth-storage') || '{"state":{}}').state;
  if (storedState.theme) {
    useAuthStore.getState().applyThemeEffects(storedState.theme as ThemeType);
  }
}
