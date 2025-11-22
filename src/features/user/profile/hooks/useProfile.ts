import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileAPI } from "../api/profile.api";
import type { UserProfile, UpdateProfileInput, ChangePasswordInput } from "../types";
import { toast } from "sonner";

export const useProfile = () =>
  useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: profileAPI.getProfile,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation<UserProfile, Error, Partial<UpdateProfileInput>>({
    mutationFn: profileAPI.updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useChangePassword = () => {
  return useMutation<void, Error, ChangePasswordInput>({
    mutationFn: profileAPI.changePassword,
    onSuccess: () => toast.success("Password changed successfully"),
    onError: (err) => toast.error(err.message),
  });
};

export const useDeactivateAccount = () => {
  return useMutation({
    mutationFn: profileAPI.deactivateAccount,
    onSuccess: () => {
      toast.success("Account deactivated. Logging out…");
      // Clear auth cookie/localStorage and reload
      window.location.href = "/login"; // redirect to login
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => toast.error(err.message),
  });
};
