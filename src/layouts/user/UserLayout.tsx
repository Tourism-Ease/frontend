// src/layouts/UserLayout.tsx
import { Outlet } from 'react-router';
import UserNavbar from './components/UserNavbar';

export default function UserLayout() {
  return (
    <div>
      {/* User Navbar */}
      <UserNavbar></UserNavbar>
      {/* Theme Toggle */}

      <main>
        <Outlet />
      </main>

      {/* User Footer */}
    </div>
  );
}
