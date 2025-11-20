/* eslint-disable react-refresh/only-export-components */
import { Route } from "react-router";
import { ADMIN_ROUTES } from "../constants/routes";
import AdminLayout from "../layouts/admin/AdminLayout";
import DestinationsPage from "@/features/admin/destinations/pages/DestinationsPage";
import AddDestinationPage from "@/features/admin/destinations/pages/AddDestinationPage";
import EditDestinationPage from "@/features/admin/destinations/pages/EditDestinationPage";
import TransportationsPage from "@/features/admin/transportations/pages/TransportationsPage";
import AddTransportationPage from "@/features/admin/transportations/pages/AddTransportationPage";
import EditTransportationPage from "@/features/admin/transportations/pages/EditTransportationPage";
import HotelsPage from "@/features/admin/hotels/pages/HotelsPage";
import HotelDetailsPage from "@/features/admin/hotels/pages/HotelDetailsPage";
import AddHotelPage from "@/features/admin/hotels/pages/AddHotelPage";
import EditHotelPage from "@/features/admin/hotels/pages/EditHotelPage";
import TripsPage from "@/features/admin/trips/pages/TripPage";
import UsersPage from "@/features/admin/users/pages/UsersPage";
import EditUserPage from "@/features/admin/users/pages/EditUserPage";
import AddUserPage from "@/features/admin/users/pages/AddUserPage";

// Placeholder components
const Dashboard = () => <div>Admin Dashboard</div>;
const AddTrip = () => <div>Add Trip</div>;
const EditTrip = () => <div>Edit Trip</div>;

const Bookings = () => <div>Bookings</div>;
const Reports = () => <div>Reports</div>;
const Settings = () => <div>Settings</div>;

// Helper to convert `/admin/trips` → `trips`
const relative = (path: string) => path.replace(`${ADMIN_ROUTES.ROOT}/`, "");

export const adminRoutes = (
  <>
    <Route path={ADMIN_ROUTES.ROOT} element={<AdminLayout />}>
      {/* Dashboard */}
      <Route path={relative(ADMIN_ROUTES.DASHBOARD)} element={<Dashboard />} />
      {/* Destinations */}
      <Route
        path={relative(ADMIN_ROUTES.DESTINATIONS)}
        element={<DestinationsPage />}
      />
      <Route
        path={relative(ADMIN_ROUTES.ADD_DESTINATION)}
        element={<AddDestinationPage />}
      />
      <Route
        path={relative(ADMIN_ROUTES.EDIT_DESTINATION())}
        element={<EditDestinationPage />}
      />
      {/* Transportations */}
      <Route
        path={relative(ADMIN_ROUTES.TRANSPORTATIONS)}
        element={<TransportationsPage />}
      />
      <Route
        path={relative(ADMIN_ROUTES.ADD_TRANSPORTATION)}
        element={<AddTransportationPage />}
      />
      <Route
        path={relative(ADMIN_ROUTES.EDIT_TRANSPORTATION())}
        element={<EditTransportationPage />}
      />
      {/* Hotels */}
      <Route path={relative(ADMIN_ROUTES.HOTELS)} element={<HotelsPage />} />
      <Route
        path={relative(ADMIN_ROUTES.HOTEL_DETAILS())}
        element={<HotelDetailsPage />}
      />
      <Route
        path={relative(ADMIN_ROUTES.ADD_HOTEL)}
        element={<AddHotelPage />}
      />
      <Route
        path={relative(ADMIN_ROUTES.EDIT_HOTEL())}
        element={<EditHotelPage />}
      />
      {/* Trips */}
      <Route path={relative(ADMIN_ROUTES.TRIPS)} element={<TripsPage />} />
      <Route path={relative(ADMIN_ROUTES.ADD_TRIP)} element={<AddTrip />} />
      <Route path={relative(ADMIN_ROUTES.EDIT_TRIP())} element={<EditTrip />} />
      
      {/* Users */}
      <Route path={relative(ADMIN_ROUTES.USERS)} element={<UsersPage />} />
      <Route path={relative(ADMIN_ROUTES.ADD_USER)} element={<AddUserPage />} />
      <Route path={relative(ADMIN_ROUTES.EDIT_USER())} element={<EditUserPage />} />
      {/* Others */}
      <Route path={relative(ADMIN_ROUTES.BOOKINGS)} element={<Bookings />} />
      <Route path={relative(ADMIN_ROUTES.REPORTS)} element={<Reports />} />
      <Route path={relative(ADMIN_ROUTES.SETTINGS)} element={<Settings />} />
    </Route>
  </>
);
