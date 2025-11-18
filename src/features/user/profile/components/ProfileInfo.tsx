import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaTrash, FaPen } from "react-icons/fa";
import {
  useDeactivateAccount,
  useProfile,
  useUpdateProfile,
} from "../hooks/useProfile";
import type { UpdateProfileInput, UserProfile } from "../types";
import ChangePasswordModal from "./ChangePasswordModal";
import DeactivateAccountModal from "./DeactivateAccountModal";

import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";

export default function ProfileInfo() {
  const { data: user } = useProfile();
  const updateProfile = useUpdateProfile();
  const { mutate: deactivateAccount } = useDeactivateAccount();

  const [editMode, setEditMode] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);

  const [form, setForm] = useState<UpdateProfileInput>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      avatar: null,
    });
    setImagePreview(null);
  }, [user]);

  const autoSave = (newData: Partial<UpdateProfileInput>) => {
    updateProfile.mutate(newData, {
      onSuccess: () => toast.success("Profile updated"),
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleFieldChange =
    (field: keyof UpdateProfileInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleFieldBlur = (field: keyof UpdateProfileInput) => () => {
    autoSave({ [field]: form[field] });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG or PNG images allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setForm((prev) => ({ ...prev, avatar: file }));
    toast.info("Uploading image…");

    updateProfile.mutate(
      { avatar: file },
      {
        onSuccess: () => toast.success("Profile picture updated!"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleRemoveAvatar = () => {
    setImagePreview(null);
    toast.info("Removing picture…");

    updateProfile.mutate(
      { avatar: null },
      {
        onSuccess: () => toast.success("Profile picture removed"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const getInitials = (u: UserProfile) =>
    `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();

  const toggleEdit = () => {
    if (editMode) toast.success("Changes saved");
    else toast.info("You can now edit your profile");
    setEditMode(!editMode);
  };

  if (!user) return null;

  return (
    <div className="space-y-2 mt-14 max-w-3xl mx-auto">
      {/* Avatar Section */}
      <div className="p-6 rounded-xl border bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32 shadow border cursor-pointer">
            <AvatarImage src={imagePreview || user.avatarUrl || undefined} />
            <AvatarFallback>{getInitials(user)}</AvatarFallback>
          </Avatar>

          {editMode && (
            <>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden cursor-pointer"
              />
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    document.getElementById("profile-image")?.click()
                  }
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
                >
                  <FaPen /> Edit
                </button>

                {(imagePreview || user.avatarUrl) && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition cursor-pointer"
                  >
                    <FaTrash /> Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-xl border bg-white shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Profile Information</h2>
          <Button onClick={toggleEdit} className="cursor-pointer">
            {editMode ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>First Name</Label>
            <Input
              disabled={!editMode}
              value={form.firstName}
              onChange={handleFieldChange("firstName")}
              onBlur={handleFieldBlur("firstName")}
              className="cursor-text"
            />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input
              disabled={!editMode}
              value={form.lastName}
              onChange={handleFieldChange("lastName")}
              onBlur={handleFieldBlur("lastName")}
              className="cursor-text"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Email</Label>
            <Input disabled value={form.email} className="bg-gray-100 cursor-not-allowed" />
          </div>

          <div className="md:col-span-2">
            <Label>Phone</Label>
            <Input
              disabled={!editMode}
              value={form.phone}
              onChange={handleFieldChange("phone")}
              onBlur={handleFieldBlur("phone")}
              className="cursor-text"
            />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setOpenPasswordModal(true)}
          className="cursor-pointer"
        >
          Change Password
        </Button>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        open={openPasswordModal}
        onOpenChange={setOpenPasswordModal}
      />

      {/* Danger Zone */}
      <div className="p-6 rounded-xl border bg-red-50 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        <p className="text-red-600">
          Be careful with these actions. They cannot be undone easily.
        </p>
        <div className="flex flex-col md:flex-row gap-4 text-white">
          <Button
            variant="destructive"
            onClick={() => setOpenDeactivateModal(true)}
            className="cursor-pointer"
          >
            Deactivate Account
          </Button>
        </div>
      </div>

      <DeactivateAccountModal
        open={openDeactivateModal}
        onOpenChange={setOpenDeactivateModal}
        onConfirm={() => deactivateAccount()}
      />
    </div>
  );
}
