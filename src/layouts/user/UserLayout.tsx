// src/layouts/UserLayout.tsx
import { Outlet } from 'react-router';

export default function UserLayout() {
  return (
    <div>
      {/* User Navbar */}
      {/* Theme Toggle */}

      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>

      {/* User Footer */}
    </div>
  );
}
