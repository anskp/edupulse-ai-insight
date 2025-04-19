
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, User, Settings, LogOut, Moon, Sun, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'attendance' | 'marks' | 'announcement' | 'system';
}

const TopBar = () => {
  const { user, logout, darkMode, toggleDarkMode, theme } = useAuthStore();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Assignment',
      message: 'You have a new assignment in Mathematics.',
      time: '5 mins ago',
      read: false,
      type: 'marks'
    },
    {
      id: '2',
      title: 'Attendance Alert',
      message: 'Your attendance is below 75% in Physics.',
      time: '1 hour ago',
      read: false,
      type: 'attendance'
    },
    {
      id: '3',
      title: 'System Update',
      message: 'EduPulse system will undergo maintenance on Sunday, 4 PM to 6 PM.',
      time: '2 days ago',
      read: true,
      type: 'system'
    }
  ]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0];
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    toast({
      title: "Notification Read",
      description: "Notification marked as read",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    
    toast({
      title: "All Read",
      description: "All notifications marked as read",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notif => notif.id !== id)
    );
    
    toast({
      title: "Notification Deleted",
      description: "Notification has been removed",
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    
    toast({
      title: "All Clear",
      description: "All notifications have been cleared",
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = showAllNotifications 
    ? notifications 
    : notifications.slice(0, 3);

  // Add a new notification (for demonstration)
  const addNewNotification = () => {
    const newNotif: Notification = {
      id: `${notifications.length + 1}`,
      title: 'New Message',
      message: 'You have a new message from the system.',
      time: 'Just now',
      read: false,
      type: 'system'
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    
    toast({
      title: "New Notification",
      description: "You have received a new notification",
    });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'attendance':
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>;
      case 'marks':
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case 'announcement':
        return <div className="h-2 w-2 rounded-full bg-yellow-500"></div>;
      case 'system':
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  // Create role-specific header text
  const getRoleHeaderText = () => {
    if (!user?.role) return "Dashboard";
    
    return `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard`;
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold hidden sm:block">
            {getRoleHeaderText()}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeSwitcher />

          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Notifications</h3>
                  <div className="flex space-x-2">
                    {notifications.length > 0 && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={markAllAsRead}
                          disabled={notifications.every(n => n.read)}
                        >
                          Mark all read
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={clearAllNotifications}
                        >
                          Clear all
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Bell className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                    <p className="text-muted-foreground text-sm">No new notifications</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={addNewNotification}
                    >
                      Add demo notification
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y max-h-[300px] overflow-auto">
                    {displayedNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "py-3 px-1 cursor-pointer hover:bg-muted/50 rounded transition-colors",
                          !notification.read && "bg-muted/30"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type)}
                            <h4 className="font-medium">{notification.title}</h4>
                          </div>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex justify-end mt-2 gap-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {notifications.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => setShowAllNotifications(!showAllNotifications)}
                  >
                    {showAllNotifications ? "Show less" : `Show all (${notifications.length})`}
                  </Button>
                )}
                
                <div className="pt-2 border-t mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setNotificationOpen(false);
                      // This could navigate to a notifications page
                    }}
                  >
                    View all notifications
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Dialog>
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
                    <p className="text-xs font-medium text-primary capitalize">{user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleDarkMode}>
                  {darkMode ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>User Profile</DialogTitle>
                <DialogDescription>
                  View and update your profile information
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col items-center py-4">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{user?.department || 'Not specified'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Semester</p>
                    <p className="font-medium">{user?.semester || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
