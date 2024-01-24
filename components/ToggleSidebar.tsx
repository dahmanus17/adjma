import React from 'react';
import { CiMenuFries } from 'react-icons/ci';
import { useSidebar } from '@/components/SidebarContext';

const ToggleSidebar: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="border-b-[1px] border-neutral-600 p-5 bg-zinc-800">
      <div className="flex flex-row items-center gap-2">
        <CiMenuFries
          onClick={toggleSidebar}
          color="white"
          size={20}
          className="cursor-pointer hover:opacity-70 transition"
        />
      </div>
    </div>
  );
};

export default ToggleSidebar;
