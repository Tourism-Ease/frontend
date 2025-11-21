import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu } from "lucide-react";

export function AdminHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="h-16 border-b bg-white dark:bg-gray-900 flex items-center justify-between px-6 fixed top-0 left-0 md:left-64 right-0 z-50">
      <div className="flex items-center gap-3">
        <Menu className="md:hidden cursor-pointer" onClick={onToggleSidebar} />
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" size={20} />
        <Avatar className="cursor-pointer">
          <AvatarImage src="" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
