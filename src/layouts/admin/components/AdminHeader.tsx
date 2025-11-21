// src/layouts/admin/components/AdminHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onLogout?: () => void;
}

export function AdminHeader({ onToggleSidebar, onLogout }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  // Get user initials for fallback avatar
  const getUserInitials = () => {
    if (!user) return "A";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Get user full name for display
  const getUserFullName = () => {
    if (!user) return "Admin User";
    return `${user.firstName} ${user.lastName}`;
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

      {/* Right side - Avatar with user data */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
            <Avatar className="h-10 w-10 border-2 border-gray-300 hover:border-blue-500 transition-all duration-200">
              <AvatarImage 
                src={user?.avatarUrl || undefined} 
                alt={getUserFullName()}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserFullName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            <p className="text-xs text-blue-600 font-medium">Administrator</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/admin/profile" className="cursor-pointer w-full">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleLogout} 
            className="text-red-600 cursor-pointer focus:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}