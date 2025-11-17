/* eslint-disable react-refresh/only-export-components */
import { Route } from "react-router";
import { PUBLIC_ROUTES, USER_ROUTES } from "../constants/routes";
import UserLayout from "../layouts/user/UserLayout";
import Home from "../features/user/home/pages/Home";
import ProfileDashboard from "../features/user/profile/pages/ProfileDashboard";
import GoogleCallbackHandler from "../features/user/auth/components/GoogleCallbackHandler";
import GoogleRedirectCatcher from "../features/user/auth/components/GoogleRedirectCatcher";


// === Placeholder components (replace later) ===
const About = () => <div>About</div>;
const Contact = () => <div>Contact</div>;
const Trips = () => <div>Trips List</div>;
const TripDetails = () => <div>Trip Details</div>;

const Login = () => <div>Login</div>;
const Register = () => <div>Register</div>;
const ForgotPassword = () => <div>Forgot Password</div>;
const VerifyResetCode = () => <div>Verify Reset Code</div>;
const ResetPassword = () => <div>Reset Password</div>;

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
      <Route path={PUBLIC_ROUTES.ABOUT.replace("/", "")} element={<About />} />
      <Route
        path={PUBLIC_ROUTES.CONTACT.replace("/", "")}
        element={<Contact />}
      />
      <Route path={PUBLIC_ROUTES.TRIPS.replace("/", "")} element={<Trips />} />
      <Route
        path={PUBLIC_ROUTES.TRIP_DETAILS.replace("/", "")}
        element={<TripDetails />}
      />

      {/* Auth Routes */}
      <Route path={PUBLIC_ROUTES.LOGIN.replace("/", "")} element={<Login />} />
      <Route
        path={PUBLIC_ROUTES.REGISTER.replace("/", "")}
        element={<Register />}
      />
      <Route
        path={PUBLIC_ROUTES.FORGOT_PASSWORD.replace("/", "")}
        element={<ForgotPassword />}
      />
      <Route
        path={PUBLIC_ROUTES.VERIFY_RESET_CODE.replace("/", "")}
        element={<VerifyResetCode />}
      />
      <Route
        path={PUBLIC_ROUTES.RESET_PASSWORD.replace("/", "")}
        element={<ResetPassword />}
      />
      {/* Google OAuth */}
      <Route path={PUBLIC_ROUTES.GOOGLE_CALLBACK.replace("/", "")} element={<GoogleCallbackHandler />} />
      <Route path="/auth/google/redirect" element={<GoogleRedirectCatcher />} />
      <Route path="/api/v1/auth/google/callback" element={<GoogleRedirectCatcher />} />
      <Route path="/auth/error" element={<div>Google authentication failed. Please try again.</div>} />
      {/* User Routes */}
      <Route
        path={USER_ROUTES.PROFILE.replace("/", "")}
        element={<ProfileDashboard />}
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
