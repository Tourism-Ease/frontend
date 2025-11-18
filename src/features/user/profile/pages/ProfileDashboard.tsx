import { useState } from "react";
import { User, Map, ChevronRight, Menu } from "lucide-react";
import ProfileInfo from "../components/ProfileInfo";
import TripHistory from "../components/TripHistory";

export default function DashboardLayout() {
  const [active, setActive] = useState<"profile" | "trips">("profile");
  const [collapsed, setCollapsed] = useState(true); // collapsed by default

  return (
    <div className="w-full min-h-screen flex bg-gray-50">

      {/* SIDEBAR */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-60"
        } bg-white border-r shadow-sm p-4 flex flex-col transition-all duration-300 mt-15`}
      >
        {/* TOP HAMBURGER */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-100 mb-6 flex items-start justify-start"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">

          {/* Profile Btn */}
          <button
            onClick={() => setActive("profile")}
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            } px-4 py-2 rounded-lg transition
            ${
              active === "profile"
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {!collapsed && "Profile"}
            </span>

            {!collapsed && (
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  active === "profile" ? "rotate-90" : ""
                }`}
              />
            )}
          </button>

          {/* Trip History Btn */}
          <button
            onClick={() => setActive("trips")}
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            } px-4 py-2 rounded-lg transition
            ${
              active === "trips"
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              {!collapsed && "Trip History"}
            </span>

            {!collapsed && (
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  active === "trips" ? "rotate-90" : ""
                }`}
              />
            )}
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {active === "profile" && <ProfileInfo />}
        {active === "trips" && <TripHistory />}
      </main>
    </div>
  );
}
