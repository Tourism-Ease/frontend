import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileAPI } from "../api/profile.api";
import { toast } from "sonner";
import { useAuth } from "../../../../hooks/useAuth";

export const useDeactivateAccount = () => {
  const { logout } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: profileAPI.deactivateAccount,
    onSuccess: () => {
      toast.success("Account deactivated. Logging out…");
      logout(); 
      qc.clear(); // clear react-query cache
    },
    onError: (err: any) => toast.error(err.message),
  });
};
