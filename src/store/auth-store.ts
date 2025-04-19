
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'default' | 'car' | 'onepiece' | 'robotic' | 'mathematics' | 'moana' | 'flower';

export type UserRole = 'admin' | 'teacher' | 'student' | 'guest';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  semester?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  theme: ThemeType;
  loggedIn: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (user: User, token?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setTheme: (theme: ThemeType) => void;
  applyThemeEffects: (theme: ThemeType) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      theme: 'default',
      loggedIn: false,
      isAuthenticated: false,
      role: null,
      login: (user, token = null) => set({ 
        user, 
        token, 
        loggedIn: true, 
        isAuthenticated: true,
        role: user.role 
      }),
      logout: () => set({ 
        user: null, 
        token: null, 
        loggedIn: false, 
        isAuthenticated: false,
        role: null 
      }),
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
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
            
            // Additional car theme effects
            root.style.setProperty('--background', 'hsl(220, 20%, 95%)');
            root.style.setProperty('--card', 'hsl(220, 25%, 98%)');
            root.style.setProperty('--sidebar', 'hsl(220, 60%, 20%)');
            root.style.setProperty('--sidebar-foreground', 'hsl(220, 10%, 95%)');
            root.style.setProperty('--sidebar-accent', 'hsl(340, 90%, 55%)');
            root.style.setProperty('--sidebar-accent-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--sidebar-border', 'hsl(220, 40%, 15%)');
            break;
          case 'onepiece':
            // Pirate theme with reds and yellows
            root.style.setProperty('--primary', 'hsl(0, 80%, 50%)');
            root.style.setProperty('--primary-foreground', 'hsl(40, 80%, 90%)');
            root.style.setProperty('--secondary', 'hsl(40, 90%, 50%)');
            root.style.setProperty('--accent', 'hsl(220, 70%, 50%)');
            root.style.setProperty('--muted', 'hsl(20, 30%, 25%)');
            
            // Additional One Piece theme effects
            root.style.setProperty('--background', 'hsl(40, 30%, 95%)');
            root.style.setProperty('--card', 'hsl(40, 25%, 98%)');
            root.style.setProperty('--sidebar', 'hsl(0, 70%, 25%)');
            root.style.setProperty('--sidebar-foreground', 'hsl(40, 80%, 90%)');
            root.style.setProperty('--sidebar-accent', 'hsl(40, 90%, 50%)');
            root.style.setProperty('--sidebar-accent-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--sidebar-border', 'hsl(0, 60%, 20%)');
            break;
          case 'robotic':
            // Futuristic theme with dark backgrounds and neon accents
            root.style.setProperty('--primary', 'hsl(120, 90%, 50%)');
            root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 0%)');
            root.style.setProperty('--secondary', 'hsl(220, 90%, 60%)');
            root.style.setProperty('--accent', 'hsl(300, 90%, 50%)');
            root.style.setProperty('--muted', 'hsl(240, 15%, 15%)');
            
            // Additional robotic theme effects
            root.style.setProperty('--background', 'hsl(240, 20%, 10%)');
            root.style.setProperty('--card', 'hsl(240, 15%, 15%)');
            root.style.setProperty('--sidebar', 'hsl(240, 25%, 8%)');
            root.style.setProperty('--sidebar-foreground', 'hsl(120, 90%, 50%)');
            root.style.setProperty('--sidebar-accent', 'hsl(300, 90%, 50%)');
            root.style.setProperty('--sidebar-accent-foreground', 'hsl(0, 0%, 0%)');
            root.style.setProperty('--sidebar-border', 'hsl(240, 30%, 20%)');
            break;
          case 'mathematics':
            // Clean, precise theme with greens
            root.style.setProperty('--primary', 'hsl(120, 60%, 40%)');
            root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--secondary', 'hsl(180, 60%, 40%)');
            root.style.setProperty('--accent', 'hsl(90, 60%, 40%)');
            root.style.setProperty('--muted', 'hsl(120, 15%, 20%)');
            
            // Additional mathematics theme effects
            root.style.setProperty('--background', 'hsl(180, 15%, 95%)');
            root.style.setProperty('--card', 'hsl(180, 10%, 98%)');
            root.style.setProperty('--sidebar', 'hsl(120, 30%, 25%)');
            root.style.setProperty('--sidebar-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--sidebar-accent', 'hsl(90, 60%, 40%)');
            root.style.setProperty('--sidebar-accent-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--sidebar-border', 'hsl(120, 40%, 20%)');
            break;
          case 'moana':
            // Ocean-inspired theme with blues and teals
            root.style.setProperty('--primary', 'hsl(200, 80%, 50%)');
            root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--secondary', 'hsl(180, 70%, 50%)');
            root.style.setProperty('--accent', 'hsl(20, 90%, 60%)');
            root.style.setProperty('--muted', 'hsl(200, 30%, 20%)');
            
            // Additional Moana theme effects
            root.style.setProperty('--background', 'hsl(200, 30%, 95%)');
            root.style.setProperty('--card', 'hsl(200, 20%, 98%)');
            root.style.setProperty('--sidebar', 'hsl(200, 70%, 30%)');
            root.style.setProperty('--sidebar-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--sidebar-accent', 'hsl(20, 90%, 60%)');
            root.style.setProperty('--sidebar-accent-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--sidebar-border', 'hsl(200, 60%, 25%)');
            break;
          case 'flower':
            // Floral theme with pinks and soft colors
            root.style.setProperty('--primary', 'hsl(330, 70%, 60%)');
            root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--secondary', 'hsl(280, 60%, 70%)');
            root.style.setProperty('--accent', 'hsl(20, 80%, 80%)');
            root.style.setProperty('--muted', 'hsl(330, 20%, 25%)');
            
            // Additional flower theme effects
            root.style.setProperty('--background', 'hsl(330, 30%, 95%)');
            root.style.setProperty('--card', 'hsl(330, 20%, 98%)');
            root.style.setProperty('--sidebar', 'hsl(330, 50%, 30%)');
            root.style.setProperty('--sidebar-foreground', 'hsl(0, 0%, 100%)');
            root.style.setProperty('--sidebar-accent', 'hsl(20, 80%, 80%)');
            root.style.setProperty('--sidebar-accent-foreground', 'hsl(330, 70%, 30%)');
            root.style.setProperty('--sidebar-border', 'hsl(330, 40%, 25%)');
            break;
          default:
            // Default educational theme
            root.style.setProperty('--primary', '');
            root.style.setProperty('--primary-foreground', '');
            root.style.setProperty('--secondary', '');
            root.style.setProperty('--accent', '');
            root.style.setProperty('--muted', '');
            root.style.setProperty('--background', '');
            root.style.setProperty('--card', '');
            root.style.setProperty('--sidebar', '');
            root.style.setProperty('--sidebar-foreground', '');
            root.style.setProperty('--sidebar-accent', '');
            root.style.setProperty('--sidebar-accent-foreground', '');
            root.style.setProperty('--sidebar-border', '');
            break;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        theme: state.theme, 
        loggedIn: state.loggedIn,
        isAuthenticated: state.isAuthenticated,
        role: state.role
      }),
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
