
import { useState } from 'react';
import { Check, Car, Flower, Calculator, LayoutDashboard } from 'lucide-react';
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

const themes = [
  { id: 'default', name: 'Default', icon: <LayoutDashboard className="h-5 w-5" />, color: 'bg-purple-600' },
  { id: 'car', name: 'Car', icon: <Car className="h-5 w-5" />, color: 'bg-blue-600' },
  { id: 'onepiece', name: 'One Piece', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l3 3"/></svg>, color: 'bg-red-600' },
  { id: 'robotic', name: 'Robotic', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>, color: 'bg-gray-600' },
  { id: 'mathematics', name: 'Mathematics', icon: <Calculator className="h-5 w-5" />, color: 'bg-green-600' },
  { id: 'moana', name: 'Moana', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16.7a7 7 0 0 0-14 0"/><circle cx="9" cy="17" r="1"/><circle cx="15" cy="17" r="1"/><path d="M12 8a4 4 0 0 0-4 4"/><path d="M12 8a4 4 0 0 1 4 4"/><path d="M15 13a2 2 0 0 1 2 2"/><path d="M9 13a2 2 0 0 0-2 2"/></svg>, color: 'bg-cyan-600' },
  { id: 'flower', name: 'Flower', icon: <Flower className="h-5 w-5" />, color: 'bg-pink-600' },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as ThemeType);
    setIsOpen(false);
  };

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 px-3"
          aria-label="Select a theme"
        >
          <div className={cn("h-5 w-5 rounded-full flex items-center justify-center", currentTheme.color)}>
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
                "justify-start gap-2",
                theme === themeOption.id && "border-2 border-primary"
              )}
              onClick={() => handleThemeChange(themeOption.id)}
            >
              <div className={cn("h-5 w-5 rounded-full flex items-center justify-center", themeOption.color)}>
                {themeOption.icon}
              </div>
              <span>{themeOption.name}</span>
              {theme === themeOption.id && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
