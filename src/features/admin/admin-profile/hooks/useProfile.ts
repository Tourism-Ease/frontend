// hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchCurrentUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../api/profile.api";
import type { 
  User, 
  UpdateProfileDto, 
  UpdateProfileFormData,
  ChangePasswordDto, 
  ChangePasswordResponse   
} from "../../users/types/user.type";

export const PROFILE_QK = ['profile'] as const;

// Helper function to clean phone number
const cleanPhoneNumber = (phone?: string): string | undefined => {
  if (!phone) return undefined;
  const cleaned = phone.trim();
  return cleaned === '' ? undefined : cleaned;
};

// GET current user profile
export function useProfileQuery() {
  return useQuery<User>({
    queryKey: PROFILE_QK,
    queryFn: fetchCurrentUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// UPDATE profile
export function useUpdateProfileMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileFormData | FormData) => {
      // Handle FormData (with file upload)
      if (payload instanceof FormData) {
        return updateUserProfile(payload);
      }
      
      // Handle regular object - convert to UpdateProfileDto and clean phone number
      const cleanedPayload: UpdateProfileDto = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: cleanPhoneNumber(payload.phone),
      };
      
      return updateUserProfile(cleanedPayload);
    },

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: PROFILE_QK });
      const prev = qc.getQueryData<User>(PROFILE_QK);

      // Only optimistic update for non-file, non-FormData updates
      if (prev && !(payload instanceof FormData)) {
        const cleanedPayload = {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: cleanPhoneNumber(payload.phone),
        };
        
        qc.setQueryData<User>(PROFILE_QK, {
          ...prev,
          ...cleanedPayload,
        });
      }

      toast.loading("Updating profile...", { id: 'update-profile' });
      return { prev };
    },

    onError: (error, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(PROFILE_QK, ctx.prev);
      
      toast.error("Failed to update profile", {
        id: 'update-profile',
        description: "Please check your inputs and try again.",
      });
      console.error('Error updating profile:', error);
    },

    onSuccess: (updatedUser) => {
      qc.setQueryData<User>(PROFILE_QK, updatedUser);
      
      toast.success("Profile updated successfully!", {
        id: 'update-profile',
        description: "Your profile has been updated.",
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: PROFILE_QK });
    },
  });
}

// CHANGE password
export function useChangePasswordMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangePasswordDto) => changeUserPassword(payload),

    onMutate: () => {
      toast.loading("Changing password...", { id: 'change-password' });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to change password";
      toast.error("Failed to change password", {
        id: 'change-password',
        description: errorMessage,
      });
      console.error('Error changing password:', error);
    },

    onSuccess: (data: ChangePasswordResponse) => {
      toast.success("Password changed successfully!", {
        id: 'change-password',
        description: "Your password has been updated.",
      });
      
      // Update profile data with new user data
      qc.setQueryData<User>(PROFILE_QK, data.data);
      
      // Handle token update
      if (data.token) {
        localStorage.setItem('token', data.token);
        // You might want to trigger a context update here
      }
    },
  });
}