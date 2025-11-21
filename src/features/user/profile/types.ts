// ==========================
// Update Profile Input
// ==========================
export interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: File | null;
}

// ==========================
// Change Password
// ==========================
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ==========================
// Trips
// ==========================
export interface Trip {
  id: string;
  destination: string;
  date: string;
  price: number;
  status: "completed" | "cancelled" | "upcoming";
}

export interface TripsResponse {
  trips: Trip[];
}

// ==========================
// API Response Model
// ==========================
export interface ApiResponse<T> {
  status: "success";
  data: T;
  token?: string;
}

export interface ApiSuccess<T> {
  status: "success";
  data: T;
}

export interface ApiError {
  status: "error" | "fail";
  message: string;
}