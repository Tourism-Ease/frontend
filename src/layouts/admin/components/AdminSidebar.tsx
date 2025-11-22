import { SidebarLink } from "./SidebarLink";
import { ADMIN_ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  Plane,
  Map,
  Hotel,
  Bus,
  Users,
  X,
  Ticket,
  Package 
} from "lucide-react";

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const sidebarItems = [
    {
      label: "Dashboard",
      to: ADMIN_ROUTES.DASHBOARD,
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Packages",
      to: ADMIN_ROUTES.PACKAGE,
      icon: <Package size={18} />,
    },
    {
      label: "Destinations",
      to: ADMIN_ROUTES.DESTINATIONS,
      icon: <Map size={18} />,
    },
    {
      label: 'Transportations',
      to: ADMIN_ROUTES.TRANSPORTATIONS,
      icon: <Bus size={18} />,
    },
    { label: 'Hotels', to: ADMIN_ROUTES.HOTELS, icon: <Hotel size={18} /> },
    { label: 'Trips', to: ADMIN_ROUTES.TRIPS, icon: <Plane size={18} /> },
    { label: 'Users', to: ADMIN_ROUTES.USERS, icon: <Users size={18} /> },
    {
      label: "Bookings",
      to: ADMIN_ROUTES.BOOKINGS,
      icon: <Ticket size={18} />,
    },

  ];

  return (
    <>
      {/* MOBILE backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 md:hidden z-40"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-card border-r px-4 py-6 z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 border border-blue-500/40 text-blue-600 p-2 rounded-full">
              <Map size={20} />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold">Safarny</span>
              <span className="text-xs text-muted-foreground font-medium tracking-wide">
                Admin Panel
              </span>
            </div>
          </div>

          <button className="md:hidden cursor-pointer" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <SidebarLink
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
