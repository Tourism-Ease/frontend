import type {
  ApiResponse,
  UserProfile,
  UpdateProfileInput,
  ChangePasswordInput,
  TripsResponse,
} from "../types";
import http from "../../../../lib/axios";

export const getMyProfile = async (): Promise<UserProfile> => {
  const { data } = await http.get<ApiResponse<UserProfile>>("/users/profile");
  return data.data;
};

export const updateMyProfile = async (
  body: UpdateProfileInput
): Promise<UserProfile> => {
  const form = new FormData();

  // Add text fields
  if (body.firstName) form.append('firstName', body.firstName);
  if (body.lastName) form.append('lastName', body.lastName);
  if (body.email) form.append('email', body.email);
  if (body.phone) form.append('phone', body.phone);

  // Add file if exists
  if (body.profileImage) {
    form.append('avatar', body.profileImage);
  }

  const res = await http.put<ApiResponse<UserProfile>>("/users/updateMe", form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};

export const changeMyPassword = async (
  body: ChangePasswordInput
): Promise<{ user: UserProfile; token: string }> => {
  const { data } = await http.patch<ApiResponse<UserProfile>>(
    "/users/changeMyPassword",
    { currentPassword: body.currentPassword, password: body.newPassword }
  );

  return { user: data.data, token: data.token! };
};

export const getMyTrips = async (): Promise<TripsResponse> => {
  try {
    const { data } = await http.get<ApiResponse<TripsResponse>>("/users/trips");
    return data.data;
  } catch (error) {
    // Return empty trips array if endpoint doesn't exist yet
    console.warn("Trips endpoint not available:", error);
    return { trips: [] };
  }
};
