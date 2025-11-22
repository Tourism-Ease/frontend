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
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useState } from "react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [, setImageLoaded] = useState<{ [key: string]: boolean }>({});

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/admin/profile");
  };

  const handleImageLoad = (userId: string) => {
    setImageLoaded((prev) => ({ ...prev, [userId]: true }));
  };

  const handleImageError = (userId: string) => {
    setImageLoaded((prev) => ({ ...prev, [userId]: false }));
  };

  // Get user initials for fallback avatar
  const getUserInitials = () => {
    if (!user) return "AD";
    return (
      `${user.firstName?.charAt(0) || ""}${
        user.lastName?.charAt(0) || ""
      }`.toUpperCase() || "AD"
    );
  };

  // Get user full name for display
  const getUserFullName = () => {
    if (!user) return "Admin User";
    return `${user.firstName} ${user.lastName}`;
  };

  // Check if user has avatar and it's loaded

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
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span className="text-sm text-gray-600">Loading...</span>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full cursor-pointer p-0"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Spinner size="sm" />
                </div>
              ) : (
                <Avatar className="h-10 w-10 border-2 border-gray-300 hover:border-blue-500 transition-all duration-200">
                  <AvatarImage
                    src={user?.avatarUrl || undefined}
                    alt={getUserFullName()}
                    className="object-cover"
                    onLoad={() => user && handleImageLoad(user.id)}
                    onError={() => user && handleImageError(user.id)}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {getUserFullName()}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
              <p className="text-xs text-blue-600 font-medium">Administrator</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/admin/profile"
                className="cursor-pointer w-full"
                onClick={handleProfileClick}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-600 cursor-pointer focus:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
