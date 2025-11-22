// Public Routes
// =====================
export const PUBLIC_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  TRIPS: "/trips",
  TRIP_DETAILS: "/trips/:id",
  HOTEL_DETAILS: "/HotelDetails/:id",
  PACKAGE: "/packages",
  PACKAGE_DETAILS: "/packages/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_RESET_CODE: "/verify-reset-code",
  RESET_PASSWORD: "/reset-password",
} as const;

// User Routes
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

// Admin Routes
export const ADMIN_ROUTES = {
  ROOT: "/admin",
  DASHBOARD: "/admin/dashboard",
  PROFILE: "/admin/profile",

  PACKAGE: "/admin/packages",
  PACKAGE_DETAILS: (id: string = ":id") => `/admin/packages/${id}`,
  ADD_PACKAGE: "/admin/packages/add",
  EDIT_PACKAGE: (id: string = ":id") => `/admin/packages/edit/${id}`,

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
  TRIP_DETAILS: (id: string = ':id') => `/admin/trips/${id}`,
  ADD_TRIP: '/admin/trips/add',
  EDIT_TRIP: (id: string = ':id') => `/admin/trips/edit/${id}`,

  USERS: '/admin/users',
  USER_DETAILS: (id: string = ':id') => `/admin/users/${id}`,
  ADD_USER: '/admin/users/add',
  EDIT_USER: (id: string = ':id') => `/admin/users/edit/${id}`,

  BOOKINGS: '/admin/bookings',
  BOOKING_DETAILS: (id: string = ':id') => `/admin/bookings/${id}`,
} as const;
