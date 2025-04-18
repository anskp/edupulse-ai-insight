
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  FileText,
  Cog,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { role, logout } = useAuthStore();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/admin/teachers', label: 'Teachers', icon: <Users size={20} /> },
    { to: '/admin/students', label: 'Students', icon: <GraduationCap size={20} /> },
    { to: '/admin/reports', label: 'Reports', icon: <FileText size={20} /> },
    { to: '/admin/settings', label: 'Settings', icon: <Cog size={20} /> },
  ];

  const teacherLinks = [
    { to: '/teacher', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/teacher/students', label: 'Students', icon: <GraduationCap size={20} /> },
    { to: '/teacher/marks', label: 'Marks', icon: <BookOpen size={20} /> },
    { to: '/teacher/predictions', label: 'Predictions', icon: <BarChart2 size={20} /> },
    { to: '/teacher/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const studentLinks = [
    { to: '/student', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/student/marks', label: 'My Marks', icon: <BookOpen size={20} /> },
    { to: '/student/performance', label: 'Performance', icon: <BarChart2 size={20} /> },
    { to: '/student/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const links = role === 'admin' ? adminLinks : role === 'teacher' ? teacherLinks : studentLinks;

  // Close mobile sidebar when navigating to a new page
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleMobileSidebar}>
          <Menu size={20} />
        </Button>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden',
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={toggleMobileSidebar}
      />

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-[70px]' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 h-16 border-b border-sidebar-border">
            <div className={cn('flex items-center overflow-hidden', isCollapsed && 'justify-center w-full')}>
              {!isCollapsed ? (
                <div className="font-bold text-xl whitespace-nowrap">
                  <span className="text-white">Edu</span>
                  <span className="text-sidebar-accent">Pulse</span>
                </div>
              ) : (
                <div className="font-bold text-xl">
                  <span className="text-white">E</span>
                  <span className="text-sidebar-accent">P</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
              onClick={toggleSidebar}
            >
              <ChevronLeft size={18} className={cn('transition-transform', isCollapsed && 'rotate-180')} />
            </Button>
          </div>

          <nav className="flex-1 pt-4 px-2 overflow-y-auto">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md transition-colors',
                      location.pathname === link.to || location.pathname.startsWith(link.to + '/')
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-primary/10',
                      isCollapsed && 'justify-center'
                    )}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {!isCollapsed && <span>{link.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className={cn(
                'w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isCollapsed && 'justify-center p-2'
              )}
              onClick={logout}
            >
              <LogOut size={18} className="mr-2" />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
