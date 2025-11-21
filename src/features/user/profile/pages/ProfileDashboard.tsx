import { useState } from "react";
import { User, Map, ChevronRight } from "lucide-react";
import ProfileInfo from "../components/ProfileInfo";
import TripHistory from "../components/TripHistory";

export default function DashboardLayout() {
  const [active, setActive] = useState<"profile" | "trips">("profile");

  return (
    <div className="w-full min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r shadow-sm p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

        <nav className="flex flex-col gap-2">
          {/* Profile Link */}
          <button
            onClick={() => setActive("profile")}
            className={`flex items-center justify-between px-4 py-2 rounded-lg text-left transition
              ${active === "profile"
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
              }`}
          >
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </span>
            <ChevronRight className={`w-4 h-4 transition-transform ${active === "profile" ? "rotate-90" : ""}`} />
          </button>

          {/* Trip History Link */}
          <button
            onClick={() => setActive("trips")}
            className={`flex items-center justify-between px-4 py-2 rounded-lg text-left transition
              ${active === "trips"
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
              }`}
          >
            <span className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Trip History
            </span>
            <ChevronRight className={`w-4 h-4 transition-transform ${active === "trips" ? "rotate-90" : ""}`} />
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {active === "profile" && <ProfileInfo />}
        {active === "trips" && <TripHistory />}
      </main>
    </div>
  );
}
