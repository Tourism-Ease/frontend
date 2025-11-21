// src/features/user/profile/components/ChangePasswordModal.tsx
import { useState } from "react";
import { useChangePassword } from "../hooks/useProfile";
import type { ChangePasswordInput } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordModal({ open, onOpenChange }: Props) {
  const changePassword = useChangePassword();

  const [form, setForm] = useState<ChangePasswordInput>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInput = (key: keyof ChangePasswordInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    changePassword.mutate(form, {
      onSuccess: () => {
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        onOpenChange(false);
        toast.success("Password changed successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to change password");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and set a new one.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              value={form.currentPassword}
              onChange={handleInput("currentPassword")}
              required
              disabled={changePassword.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password (min 6 characters)"
              value={form.newPassword}
              onChange={handleInput("newPassword")}
              required
              minLength={6}
              disabled={changePassword.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={form.confirmPassword}
              onChange={handleInput("confirmPassword")}
              required
              disabled={changePassword.isPending}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={changePassword.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={changePassword.isPending || !form.currentPassword || !form.newPassword || !form.confirmPassword}
            >
              {changePassword.isPending ? <Spinner size="sm" /> : "Change Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}