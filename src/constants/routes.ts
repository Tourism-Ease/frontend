// =====================
// Public Routes

// =====================
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  TRIPS: '/trips',
  TRIP_DETAILS: '/trips/:id',
  HOTEL_DETAILS: '/HotelDetails/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_RESET_CODE: '/verify-reset-code',
  RESET_PASSWORD: '/reset-password',
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
  DASHBOARD: '/admin/dashboard',

  DESTINATIONS: '/admin/destinations',
  ADD_DESTINATION: '/admin/destinations/add',
  EDIT_DESTINATION: (id: string = ':id') => `/admin/destinations/edit/${id}`,

  TRANSPORTATIONS: '/admin/transportations',
  ADD_TRANSPORTATION: '/admin/transportations/add',
  EDIT_TRANSPORTATION: (id: string = ':id') =>
    `/admin/transportations/edit/${id}`,

  HOTELS: '/admin/hotels',
  HOTEL_DETAILS: (id: string = ':id') => `/admin/hotels/${id}`,
  ADD_HOTEL: '/admin/hotels/add',
  EDIT_HOTEL: (id: string = ':id') => `/admin/hotels/edit/${id}`,

  TRIPS: '/admin/trips',
  ADD_TRIP: '/admin/trips/add',
  EDIT_TRIP: (id: string = ':id') => `/admin/trips/edit/${id}`,

  USERS: '/admin/users',
  BOOKINGS: '/admin/bookings',
  REPORTS: '/admin/reports',
  SETTINGS: '/admin/settings',
} as const;
