import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileAPI } from "../api/profile.api";
import type { UserProfile, UpdateProfileInput, ChangePasswordInput } from "../types";
import { toast } from "sonner";

// Fetch user profile
export const useProfile = () => useQuery<UserProfile>({ queryKey: ["profile"], queryFn: profileAPI.getProfile });

// Update profile (with or without avatar)
export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation<UserProfile, Error, Partial<UpdateProfileInput>>({
    mutationFn: profileAPI.updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update profile");
    },
  });
};



// Change password
export const useChangePassword = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, ChangePasswordInput>({
    mutationFn: profileAPI.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });
};
