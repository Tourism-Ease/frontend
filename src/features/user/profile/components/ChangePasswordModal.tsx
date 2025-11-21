import { useState } from "react";
import { useChangePassword } from "../hooks/useProfile";
import type { ChangePasswordInput } from "../types";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { toast } from "sonner";

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

  const handleInput =
    (key: keyof ChangePasswordInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [key]: e.target.value });
    };

  const submit = (): void => {
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    changePassword.mutate(form, {
      onSuccess: () => {
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        onOpenChange(false);
        toast.success("Password changed successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Old Password</Label>
            <Input
              type="password"
              placeholder="Enter old password"
              value={form.currentPassword}
              onChange={handleInput("currentPassword")}
              className="cursor-text"
            />
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleInput("newPassword")}
              className="cursor-text"
            />
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleInput("confirmPassword")}
              className="cursor-text"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button className="cursor-pointer" onClick={submit}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
