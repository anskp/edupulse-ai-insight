
import React from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar />
        <main className={cn('p-6', className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
