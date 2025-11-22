import { useState } from "react";
import ProfileInfo from "../components/ProfileInfo";
import TripHistory from "../components/TripHistory";

export default function DashboardLayout() {
  const [active] = useState<"profile" | "trips">("profile");

  return (
    <div className="w-full min-h-screen flex bg-gray-50">
      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {active === "profile" && <ProfileInfo />}
        {active === "trips" && <TripHistory />}
      </main>
    </div>
  );
}
