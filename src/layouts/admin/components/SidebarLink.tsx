import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
}

export function SidebarLink({ to, icon, label }: SidebarLinkProps) {
  return (
    <NavLink
    to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
          isActive
            ? "bg-primary text-white"
            : "text-muted-foreground hover:bg-muted"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
