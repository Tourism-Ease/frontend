// api/profile.api.ts
import http from "@/lib/axios";
import type {
  User,
  UpdateProfileDto,
  ChangePasswordDto,
  ChangePasswordResponse,
  ProfileResponse,
} from "../../users/types/user.type";

const RESOURCE = "/users";

// Helper function to clean phone number - send null if empty
const cleanPhoneNumber = (phone?: string): string | null => {
  if (!phone) return null;
  const cleaned = phone.trim();
  return cleaned === "" ? null : cleaned;
};

// GET current user profile
export async function fetchCurrentUserProfile(): Promise<User> {
  try {
    const { data } = await http.get<ProfileResponse>(`${RESOURCE}/profile`);
    return data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// UPDATE profile
export async function updateUserProfile(
  payload: UpdateProfileDto | FormData
): Promise<User> {
  try {
    let response;

    if (payload instanceof FormData) {
      // Handle file upload with FormData
      response = await http.put<ProfileResponse>(
        `${RESOURCE}/updateMe`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      // Handle regular JSON data - clean phone number before sending
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cleanedPayload: any = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      };

      // Only add phone if it's not null/undefined/empty
      const cleanedPhone = cleanPhoneNumber(payload.phone);
      if (cleanedPhone !== null) {
        cleanedPayload.phone = cleanedPhone;
      }

      response = await http.put<ProfileResponse>(
        `${RESOURCE}/updateMe`,
        cleanedPayload
      );
    }

    return response.data.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// CHANGE password
export async function changeUserPassword(
  payload: ChangePasswordDto
): Promise<ChangePasswordResponse> {
  try {
    const { data } = await http.patch<ChangePasswordResponse>(
      `${RESOURCE}/changeMyPassword`,
      {
        currentPassword: payload.currentPassword,
        password: payload.newPassword,
        passwordConfirm: payload.confirmPassword,
      }
    );
    return data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}
