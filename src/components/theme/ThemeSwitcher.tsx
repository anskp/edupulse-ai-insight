
import { useState, useEffect } from 'react';
import { Check, Car, Flower, Calculator, LayoutDashboard, Ship, Bot } from 'lucide-react';
import { useAuthStore, ThemeType } from '@/store/auth-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const themes = [
  { 
    id: 'default', 
    name: 'Default', 
    icon: <LayoutDashboard className="h-5 w-5" />, 
    color: 'bg-purple-600',
    description: 'Professional educational look with clean design' 
  },
  { 
    id: 'car', 
    name: 'Car', 
    icon: <Car className="h-5 w-5" />, 
    color: 'bg-blue-600',
    description: 'Fast and furious with neon accents and speed',
    animation: 'animate-pulse' 
  },
  { 
    id: 'onepiece', 
    name: 'One Piece', 
    icon: <Ship className="h-5 w-5" />, 
    color: 'bg-red-600',
    description: 'Adventure theme with manga-inspired elements',
    animation: 'animate-bounce' 
  },
  { 
    id: 'robotic', 
    name: 'Robotic', 
    icon: <Bot className="h-5 w-5" />, 
    color: 'bg-green-600',
    description: 'Futuristic tech theme with cyberpunk elements',
    animation: 'animate-pulse' 
  },
  { 
    id: 'mathematics', 
    name: 'Mathematics', 
    icon: <Calculator className="h-5 w-5" />, 
    color: 'bg-green-600',
    description: 'Clean and precise with mathematical patterns' 
  },
  { 
    id: 'moana', 
    name: 'Moana', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16.7a7 7 0 0 0-14 0"/><circle cx="9" cy="17" r="1"/><circle cx="15" cy="17" r="1"/><path d="M12 8a4 4 0 0 0-4 4"/><path d="M12 8a4 4 0 0 1 4 4"/><path d="M15 13a2 2 0 0 1 2 2"/><path d="M9 13a2 2 0 0 0-2 2"/></svg>, 
    color: 'bg-cyan-600',
    description: 'Tropical vibes with ocean-inspired effects',
    animation: 'animate-wave' 
  },
  { 
    id: 'flower', 
    name: 'Flower', 
    icon: <Flower className="h-5 w-5" />, 
    color: 'bg-pink-600',
    description: 'Delicate floral theme with soft animations',
    animation: 'animate-float' 
  }
];

export const ThemeSwitcher = () => {
  const { theme, setTheme, darkMode, toggleDarkMode } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [themeTransitioning, setThemeTransitioning] = useState(false);
  const { toast } = useToast();

  // Apply theme on component mount
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('default', 'car', 'onepiece', 'robotic', 'mathematics', 'moana', 'flower');
    
    // Apply current theme
    if (theme !== 'default') {
      document.documentElement.classList.add(theme);
    }
    
    // Apply dark mode if enabled
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setThemeTransitioning(true);
    setTheme(themeId as ThemeType);
    setIsOpen(false);
    
    // Show theme-specific toast
    const selectedTheme = themes.find(t => t.id === themeId);
    toast({
      title: `${selectedTheme?.name} Theme Applied`,
      description: selectedTheme?.description,
    });
    
    // Apply animation during theme transition
    document.documentElement.classList.add('theme-transition');
    
    // Add dramatic theme change effect
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black z-50 pointer-events-none';
    overlay.style.opacity = '0';
    document.body.appendChild(overlay);
    
    // Fade to black
    setTimeout(() => {
      overlay.style.transition = 'opacity 400ms ease';
      overlay.style.opacity = '1';
    }, 50);
    
    // Fade back from black
    setTimeout(() => {
      overlay.style.opacity = '0';
    }, 500);
    
    // Remove overlay and transition class
    setTimeout(() => {
      document.body.removeChild(overlay);
      document.documentElement.classList.remove('theme-transition');
      setThemeTransitioning(false);
    }, 1000);
  };

  // Apply CSS for theme transition
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .theme-transition * {
        transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "flex items-center gap-2 px-3 transition-all duration-300",
            themeTransitioning && "animate-pulse"
          )}
          aria-label="Select a theme"
        >
          <div className={cn(
            "h-5 w-5 rounded-full flex items-center justify-center transition-all duration-300",
            currentTheme.color
          )}>
            {currentTheme.icon}
          </div>
          <span className="hidden md:inline">{currentTheme.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-2 gap-2">
          {themes.map((themeOption) => (
            <Button
              key={themeOption.id}
              variant="outline"
              className={cn(
                "justify-start gap-2 transition-all hover:scale-105",
                theme === themeOption.id && "border-2 border-primary"
              )}
              onClick={() => handleThemeChange(themeOption.id)}
            >
              <div className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center",
                themeOption.color
              )}>
                {themeOption.icon}
              </div>
              <span>{themeOption.name}</span>
              {theme === themeOption.id && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </Button>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground px-1">
          Theme applies visual styling to various parts of the application
        </div>
        <div className="mt-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={toggleDarkMode}
          >
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
