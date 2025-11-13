import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Plane, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../../../components/ui/Button";
import LoginModalSideFull from "../../../features/user/auth/components/LoginModalSideFull";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../hooks/useAuth";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Trips", path: "/trips" },
  { name: "Destinations", path: "/destinations" },
  { name: "Bookings", path: "/bookings" },
  { name: "Contact", path: "/contact" },
];

export default function UserNavbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => setIsTransparent(window.scrollY < 100);
      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsTransparent(false);
    }
  }, [location.pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        mobileOpen &&
        menuRef.current &&
        toggleRef.current &&
        !menuRef.current.contains(target) &&
        !toggleRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md",
          isTransparent
            ? "bg-transparent border-transparent"
            : "bg-white border-b border-gray-200 shadow-sm"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Plane
              className={cn(
                "h-6 w-6",
                isTransparent ? "text-white" : "text-primary"
              )}
            />
            <span
              className={cn(
                "text-xl font-bold",
                isTransparent ? "text-white" : "text-gray-800"
              )}
            >
              TourEase
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path
                    ? "text-primary"
                    : isTransparent
                    ? "text-white drop-shadow-sm"
                    : "text-gray-700"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all duration-200">
                    <Avatar>
                      <AvatarImage
                        src={user.profileImageUrl || "/user-avatar.png"}
                        alt={user.firstName}
                        className="w-full h-full object-cover rounded-full"
                      />
                      <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700 text-sm font-semibold rounded-full">
                        {user.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700 p-2"
                >
                  <DropdownMenuLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200 px-2 py-1">
                    {user.firstName} {user.lastName}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem
                    asChild
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 rounded-md px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Link to="/profile">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 text-red-600 rounded-md px-2 py-2 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" onClick={() => setLoginOpen(true)}>
                Login
              </Button>
            )}

            {/* Mobile menu toggle with animation */}
            <Button
              ref={toggleRef}
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: mobileOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Bottom Search */}
        <div
          className={cn(
            "w-full border-t transition-all duration-300",
            isTransparent
              ? "bg-transparent border-transparent"
              : "bg-gray-50 border-gray-200"
          )}
        ></div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "fixed top-14 left-0 w-full z-50 backdrop-blur-md",
                isTransparent
                  ? "bg-transparent border-transparent"
                  : "bg-white border-b border-gray-200 shadow-sm"
              )}
            >
              <div className="flex flex-col items-center py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "text-base font-medium hover:text-primary transition",
                      location.pathname === link.path
                        ? "text-primary"
                        : "text-gray-700"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Top-level Modals */}
      <LoginModalSideFull isOpen={loginOpen} setIsOpen={setLoginOpen} />
    </>
  );
}
