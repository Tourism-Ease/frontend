/* eslint-disable react-refresh/only-export-components */
import { Route } from 'react-router'
import { ADMIN_ROUTES } from '../constants/routes'
import AdminLayout from '../layouts/admin/AdminLayout'
// import AdminProtected from '@/auth/AdminProtected'

// === Placeholder components ===
const AdminLogin = () => <div>Admin Login</div>
const Dashboard = () => <div>Admin Dashboard</div>
const Trips = () => <div>Manage Trips</div>
const AddTrip = () => <div>Add Trip</div>
const EditTrip = () => <div>Edit Trip</div>
const Destinations = () => <div>Destinations</div>
const Hotels = () => <div>Hotels</div>
const Transport = () => <div>Transport</div>
const Users = () => <div>Users</div>
const Bookings = () => <div>Bookings</div>
const Reports = () => <div>Reports</div>
const Settings = () => <div>Settings</div>

export const adminRoutes = (
  <>
    <Route
      path={ADMIN_ROUTES.ROOT}
      element={
        // <AdminProtected>
        <AdminLayout />
        // </AdminProtected>
      }
    >
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="trips" element={<Trips />} />
      <Route path="trips/add" element={<AddTrip />} />
      <Route path="trips/edit/:id" element={<EditTrip />} />
      <Route path="destinations" element={<Destinations />} />
      <Route path="hotels" element={<Hotels />} />
      <Route path="transport" element={<Transport />} />
      <Route path="users" element={<Users />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
    </Route>

    {/* Login outside layout */}
    <Route path={ADMIN_ROUTES.LOGIN} element={<AdminLogin />} />
  </>
)
