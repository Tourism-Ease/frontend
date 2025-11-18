/* eslint-disable react-refresh/only-export-components */
import { Route } from "react-router";
import { PUBLIC_ROUTES, USER_ROUTES } from "../constants/routes";
import UserLayout from "../layouts/user/UserLayout";
import Home from "../features/user/home/pages/Home";
import AboutPage from "../features/user/about/pages/AboutPage";
import ContactPage from "../features/user/contact/pages/ContactPage";
import Trips from "../features/user/trips/pages/Trips";
import TripDetails from "./../features/user/trips/pages/TripDetails";
import HotelDetails from "../features/user/Hotel/components/HotelDetails";
import GoogleCallbackHandler from "./../features/user/auth/components/GoogleCallbackHandler";
import ProtectedRoute from "./../auth/UserProtected";
import ProfileDashboard from "../features/user/profile/pages/ProfileDashboard";
import PackagesPage from "../features/user/Packages/Pages/PackagePage";

const Bookings = () => <div>My Bookings</div>;
const BookingDetails = () => <div>Booking Details</div>;
const Payments = () => <div>Payments</div>;
const Reviews = () => <div>Reviews</div>;
const AIAssistant = () => <div>AI Travel Assistant</div>;
const Recommendations = () => <div>AI Trip Recommendations</div>;

export const userRoutes = (
  <>
    <Route path={PUBLIC_ROUTES.HOME} element={<UserLayout />}>
      {/* Public Routes */}
      <Route index element={<Home />} />
      <Route
        path={PUBLIC_ROUTES.ABOUT.replace("/", "")}
        element={<AboutPage />}
      />
      <Route
        path={PUBLIC_ROUTES.CONTACT.replace("/", "")}
        element={<ContactPage />}
      />
      <Route path={PUBLIC_ROUTES.TRIPS.replace("/", "")} element={<Trips />} />
      <Route
        path={PUBLIC_ROUTES.TRIP_DETAILS.replace("/", "")}
        element={<TripDetails />}
      />
      <Route
        path={PUBLIC_ROUTES.PACKAGE.replace("/", "")}
        element={<PackagesPage />}
      />
      <Route
        path={PUBLIC_ROUTES.HOTEL_DETAILS.replace("/", "")}
        element={<HotelDetails />}
      />

      {/* Auth Routes */}
      <Route path={"/auth/success"} element={<GoogleCallbackHandler />} />
      <Route
        path="/auth/error"
        element={<div>Google authentication failed. Please try again.</div>}
      />

      {/* User Routes */}

      <Route
        path={USER_ROUTES.PROFILE.replace("/", "")}
        element={
          <ProtectedRoute requiredRole="user">
            <ProfileDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={USER_ROUTES.BOOKINGS.replace("/", "")}
        element={<Bookings />}
      />
      <Route
        path={USER_ROUTES.BOOKING_DETAILS.replace("/", "")}
        element={<BookingDetails />}
      />
      <Route
        path={USER_ROUTES.PAYMENTS.replace("/", "")}
        element={<Payments />}
      />
      <Route
        path={USER_ROUTES.REVIEWS.replace("/", "")}
        element={<Reviews />}
      />
      <Route
        path={USER_ROUTES.AI_ASSISTANT.replace("/", "")}
        element={<AIAssistant />}
      />
      <Route
        path={USER_ROUTES.RECOMMENDATIONS.replace("/", "")}
        element={<Recommendations />}
      />
    </Route>
  </>
);
