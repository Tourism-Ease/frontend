// src/layouts/UserLayout.tsx
import { Outlet } from "react-router";
import UserNavbar from "./components/UserNavbar";
import UserFooter from "./components/UserFooter";
import Chatbot from "../../features/user/chatbot/components/Chatbot";

export default function UserLayout() {
  return (
    <div>
      {/* User Navbar */}
      <UserNavbar></UserNavbar>
      {/* Theme Toggle */}

      <main>
        <Outlet />
        <Chatbot />
      </main>

      <UserFooter />
    </div>
  );
}
