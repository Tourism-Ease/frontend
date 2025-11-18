import http from "../../../../lib/axios";
import type {
  UserProfile,
  UpdateProfileInput,
  ChangePasswordInput,
  ApiResponse,
} from "../types";

export const profileAPI = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await http.get<ApiResponse<UserProfile>>(
      "/users/profile",
      { withCredentials: true }
    );
    return data.data;
  },

  updateProfile: async (
    body: Partial<UpdateProfileInput>
  ): Promise<UserProfile> => {
    if (body.avatar) {
      const formData = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formData.append(key, value as any);
        }
      });

      const { data } = await http.put<ApiResponse<UserProfile>>(
        "/users/updateMe",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return data.data;
    }

    const { data } = await http.put<ApiResponse<UserProfile>>(
      "/users/updateMe",
      body,
      { withCredentials: true }
    );

    return data.data;
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

  deactivateAccount: async (): Promise<void> => {
    await http.delete("/users/deactivateMe", { withCredentials: true });
  },
};
