import React from 'react';
import Sidebar from './layout/Sidebar';
import FollowBar from './layout/FollowBar';
import { useSidebar } from '@/components/SidebarContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarVisible } = useSidebar();

  return (
    <div className="h-screen bg-zinc-800 flex">
      {isSidebarVisible && (
        <div className="w-1/4">
          <Sidebar />
        </div>
      )}
      <div className="flex-1 border-l border-r border-neutral-700 overflow-y-scroll overflow-x-hidden">
        {children}
      </div>
      <div className="w-1/4 hidden lg:block">
        <FollowBar />
      </div>
    </div>
  );
};

export default Layout;
