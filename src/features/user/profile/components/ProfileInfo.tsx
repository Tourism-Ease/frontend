import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import type { UpdateProfileInput, UserProfile } from "../types";

import ChangePasswordModal from "./ChangePasswordModal";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";

// ...imports remain the same

export default function ProfileInfo() {
  const { data: user } = useProfile();
  const updateProfile = useUpdateProfile();

  const [editMode, setEditMode] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

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

  const handleChange =
    (field: keyof UpdateProfileInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "avatar") {
        const file = e.target.files?.[0] || null;

        if (file) {
          const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
          if (!allowedTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPEG, PNG, GIF)");
            return;
          }

          const maxSize = 5 * 1024 * 1024;
          if (file.size > maxSize) {
            toast.error("Image size must be less than 5MB");
            return;
          }

          const reader = new FileReader();
          reader.onload = (ev) => setImagePreview(ev.target?.result as string);
          reader.readAsDataURL(file);
        } else {
          setImagePreview(null);
        }
        setForm({ ...form, avatar: file });
      } else {
        setForm({ ...form, [field]: e.target.value });
      }
    };

  const handleSaveProfile = () => {
    const { firstName, lastName, phone, avatar } = form;
    updateProfile.mutate({ firstName, lastName, phone, avatar }, {
      onError: (err: Error) => {
        toast.error(err.message);
        setImagePreview(null);
      },
      onSuccess: () => {
        setEditMode(false);
        setImagePreview(null);
      },
    });
  };

  const getInitials = (u: UserProfile) => `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();

  if (!user) return null;

  return (
    <div className="space-y-10 mt-10 max-w-3xl">
      {/* Avatar */}
      <div className="flex items-center gap-6 p-6 rounded-xl border bg-white shadow-sm">
        <Avatar className="w-24 h-24 shadow-md cursor-pointer">
          <AvatarImage src={imagePreview || user.avatarUrl || undefined} />
          <AvatarFallback className="text-xl font-semibold">{getInitials(user)}</AvatarFallback>
        </Avatar>

        {editMode && (
          <div className="space-y-2">
            <label
              htmlFor="profile-image"
              className="px-4 py-2 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 border text-sm font-medium"
            >
              Choose Profile Image
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleChange("avatar")}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-xl border bg-white shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label>First Name</Label>
            <Input
              disabled={!editMode}
              value={form.firstName}
              onChange={handleChange("firstName")}
              className={`!cursor-text ${!editMode ? "bg-gray-100" : ""}`}
            />
          </div>
          <div className="space-y-1">
            <Label>Last Name</Label>
            <Input
              disabled={!editMode}
              value={form.lastName}
              onChange={handleChange("lastName")}
              className={`!cursor-text ${!editMode ? "bg-gray-100" : ""}`}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Email</Label>
            <Input disabled value={form.email} className="bg-gray-100 !cursor-text" />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Phone</Label>
            <Input
              disabled={!editMode}
              value={form.phone}
              onChange={handleChange("phone")}
              className={`!cursor-text ${!editMode ? "bg-gray-100" : ""}`}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpenPasswordModal(true)}>Change Password</Button>
          {!editMode ? (
            <Button className="cursor-pointer" onClick={() => setEditMode(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  setEditMode(false);
                  setImagePreview(null);
                  setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone || "", avatar: null });
                }}
              >
                Cancel
              </Button>
              <Button className="cursor-pointer" onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal open={openPasswordModal} onOpenChange={setOpenPasswordModal} />
    </div>
  );
}
