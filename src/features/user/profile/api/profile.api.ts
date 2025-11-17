import http from "../../../../lib/axios";
import type {
  UserProfile,
  UpdateProfileInput,
  ChangePasswordInput,
  TripsResponse,
  ApiResponse,
} from "../types";

export const profileAPI = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await http.get<ApiResponse<UserProfile>>("/users/profile", { withCredentials: true });
    return data.data;
  },

  updateProfile: async (body: Partial<UpdateProfileInput>): Promise<UserProfile> => {
    if (body.avatar) {
      const formData = new FormData();
      if (body.firstName !== undefined) formData.append("firstName", body.firstName);
      if (body.lastName !== undefined) formData.append("lastName", body.lastName);
      if (body.email !== undefined) formData.append("email", body.email);
      if (body.phone !== undefined) formData.append("phone", body.phone);
      formData.append("avatar", body.avatar);

      const { data } = await http.put<ApiResponse<UserProfile>>("/users/updateMe", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } else {
      const { data } = await http.put<ApiResponse<UserProfile>>("/users/updateMe", body, { withCredentials: true });
      return data.data;
    }
  },



  changePassword: async (body: ChangePasswordInput): Promise<void> => {
    await http.patch(
      "/users/changeMyPassword",
      {
        currentPassword: body.currentPassword,
        password: body.newPassword,
        passwordConfirm: body.confirmPassword,
      },
      { withCredentials: true }
    );
  },

  getTrips: async (): Promise<TripsResponse> => {
    try {
      const { data } = await http.get<ApiResponse<TripsResponse>>("/users/trips", { withCredentials: true });
      return data.data;
    } catch (err) {
      console.warn("Trips endpoint not available:", err);
      return { trips: [] };
    }
  },
};
