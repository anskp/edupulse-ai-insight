
import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Moon, Sun, User, Settings, LogOut } from 'lucide-react';

const TopBar = () => {
  const { user, logout } = useAuthStore();
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0];
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold hidden sm:block">
            {user?.role && (
              <span className="capitalize">{user.role}</span>
            )} Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          <Button variant="outline" size="icon" className="relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
