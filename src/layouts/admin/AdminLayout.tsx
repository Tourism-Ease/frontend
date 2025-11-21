import { useState } from 'react';
import { Outlet } from 'react-router';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 md:ml-64 flex flex-col">
        <AdminHeader onToggleSidebar={toggleSidebar} />

        <main className="pt-20 px-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
