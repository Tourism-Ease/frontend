// =====================
// Public Routes
// =====================
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  TRIPS: '/trips',
  TRIP_DETAILS: '/trips/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_RESET_CODE: '/verify-reset-code',
  RESET_PASSWORD: '/reset-password',
  GOOGLE_CALLBACK: '/auth/google/callback',
} as const;

// =====================
// User Routes
// =====================
export const USER_ROUTES = {
  ROOT: '/',
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  BOOKING_DETAILS: '/bookings/:id',
  PAYMENTS: '/payments',
  REVIEWS: '/reviews',
  AI_ASSISTANT: '/assistant',
  RECOMMENDATIONS: '/recommendations',
} as const;

// =====================
// Admin Routes
// =====================
export const ADMIN_ROUTES = {
  ROOT: '/admin',
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',
  TRIPS: '/admin/trips',
  ADD_TRIP: '/admin/trips/add',
  EDIT_TRIP: '/admin/trips/edit/:id',
  DESTINATIONS: '/admin/destinations',
  HOTELS: '/admin/hotels',
  TRANSPORTS: '/admin/transport',
  USERS: '/admin/users',
  BOOKINGS: '/admin/bookings',
  REPORTS: '/admin/reports',
  SETTINGS: '/admin/settings',
} as const;
