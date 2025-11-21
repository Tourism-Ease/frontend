import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { Link } from "react-router";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onLogout?: () => void;
}

export function AdminHeader({ onToggleSidebar, onLogout }: AdminHeaderProps) {
  const handleLogout = () => {
    if (onLogout) onLogout();
    console.log("Logging out...");
  };

  return (
    <header className="h-16 border-b bg-white dark:bg-gray-900 flex items-center justify-between px-6 fixed top-0 left-0 md:left-64 right-0 z-50">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Admin Panel
        </h2>
      </div>

      {/* Right side - Simple Avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all duration-200">
            <Avatar className="w-full h-full">
              <AvatarImage src="/default-avatar.png" alt="Admin" />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                A
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Admin User</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/admin/profile" className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}