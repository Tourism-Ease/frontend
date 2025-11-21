// src/features/user/profile/hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileAPI } from "../api/profile.api";
import type { User } from "@/context/AuthContext";
import type { UpdateProfileInput, ChangePasswordInput } from "../types";
import { toast } from "sonner";

// Fetch user profile - FIXED: Use User type instead of UserProfile
export const useProfile = () => useQuery<User>({ 
  queryKey: ["profile"], 
  queryFn: profileAPI.getProfile 
});

// Update profile - FIXED: Use User type
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, Partial<UpdateProfileInput>>({
    mutationFn: (data: Partial<UpdateProfileInput>) => profileAPI.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update profile");
    },
  });
};

// Change password - FIXED: Use User type
export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, ChangePasswordInput>({
    mutationFn: (data: ChangePasswordInput) => profileAPI.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile"], updatedUser);
      toast.success("Password changed successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to change password");
    },
  });
};