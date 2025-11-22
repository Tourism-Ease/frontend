import { Outlet } from "react-router";
import UserNavbar from "./components/UserNavbar";
import UserFooter from "./components/UserFooter";
import Chatbot from "@/features/user/chatbot/components/Chatbot";

export default function UserLayout() {
  return (
    <div>
      <UserNavbar />

      <main>
        <Outlet />
        <Chatbot />
      </main>

      <UserFooter />
    </div>
  );
}
