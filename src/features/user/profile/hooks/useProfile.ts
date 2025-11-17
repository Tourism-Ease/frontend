import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "../api/profile.api";
import type {
    UserProfile,
    UpdateProfileInput,
    ChangePasswordInput,
} from "../types";
import { toast } from "sonner";

export const useProfile = () =>
  useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation<UserProfile, Error, UpdateProfileInput>({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e) => toast.error(e.message),
  });
};

export const useChangePassword = () => {
  const qc = useQueryClient();

  return useMutation<
    { user: UserProfile; token: string },
    Error,
    ChangePasswordInput
  >({
    mutationFn: changeMyPassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e) => toast.error(e.message),
  });
};
