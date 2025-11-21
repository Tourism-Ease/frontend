// src/features/user/profile/components/ProfileInfo.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import type { UpdateProfileInput } from "../types";
import type { User } from "@/context/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";

export default function ProfileInfo() {
  const { data: user, isLoading: isProfileLoading } = useProfile();
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

  // Reset form when user data loads
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "", // Ensure phone is always a string
        avatar: null,
      });
      setImagePreview(user.avatarUrl || null);
    }
  }, [user]);

  const handleChange =
    (field: keyof UpdateProfileInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "avatar") {
        const file = e.target.files?.[0] || null;

        if (file) {
          // Validate file type
          const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
          ];
          if (!allowedTypes.includes(file.type)) {
            toast.error(
              "Please select a valid image file (JPEG, PNG, GIF, WebP)"
            );
            return;
          }

          // Validate file size (5MB max)
          const maxSize = 5 * 1024 * 1024;
          if (file.size > maxSize) {
            toast.error("Image size must be less than 5MB");
            return;
          }

          // Create preview
          const reader = new FileReader();
          reader.onload = (ev) => setImagePreview(ev.target?.result as string);
          reader.readAsDataURL(file);

          setForm((prev) => ({ ...prev, avatar: file }));
        } else {
          setImagePreview(user?.avatarUrl || null);
          setForm((prev) => ({ ...prev, avatar: null }));
        }
      } else {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      }
    };

  const handleSaveProfile = () => {
    if (!user) return;

    // Basic validation
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    // Prepare update data - phone is now guaranteed to be a string
    const updateData: Partial<UpdateProfileInput> = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone ? form.phone.trim() : undefined, // No need for undefined check now
    };

    // Only include avatar if it's a new file
    if (form.avatar instanceof File) {
      updateData.avatar = form.avatar;
    }

    updateProfile.mutate(updateData, {
      onSuccess: () => {
        setEditMode(false);
        // Reset the avatar preview to the updated user data
        if (user) {
          setImagePreview(user.avatarUrl || null);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
        // Keep the form in edit mode on error
      },
    });
  };

  const handleCancelEdit = () => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "", // Ensure phone is always a string
        avatar: null,
      });
      setImagePreview(user.avatarUrl || null);
    }
    setEditMode(false);
  };

  const getInitials = (user: User) =>
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-500 min-h-64 flex items-center justify-center">
        Failed to load profile data
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-10 max-w-3xl">
      {/* Avatar Section */}
      <div className="flex items-center gap-6 p-6 rounded-xl border bg-white shadow-sm">
        <div className="relative">
          <Avatar className="w-24 h-24 shadow-md">
            <AvatarImage
              src={imagePreview || user.avatarUrl || undefined}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-600">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          {updateProfile.isPending && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <Spinner size="sm" className="text-white" />
            </div>
          )}
        </div>

        {editMode && (
          <div className="space-y-2">
            <label
              htmlFor="profile-image"
              className="px-4 py-2 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 border text-sm font-medium transition-colors"
            >
              Choose Profile Image
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleChange("avatar")}
              className="hidden"
              disabled={updateProfile.isPending}
            />
            {form.avatar && (
              <p className="text-sm text-green-600">
                New image selected: {form.avatar.name}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-xl border bg-white shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              disabled={!editMode || updateProfile.isPending}
              value={form.firstName}
              onChange={handleChange("firstName")}
              placeholder="Enter your first name"
              className={!editMode ? "bg-gray-50" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              disabled={!editMode || updateProfile.isPending}
              value={form.lastName}
              onChange={handleChange("lastName")}
              placeholder="Enter your last name"
              className={!editMode ? "bg-gray-50" : ""}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              disabled
              value={form.email}
              className="bg-gray-50 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500">Email cannot be changed</p>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              disabled={!editMode || updateProfile.isPending}
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="Enter your phone number"
              className={!editMode ? "bg-gray-50" : ""}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpenPasswordModal(true)}
            disabled={updateProfile.isPending}
          >
            Change Password
          </Button>

          {!editMode ? (
            <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={updateProfile.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={
                  updateProfile.isPending ||
                  !form.firstName.trim() ||
                  !form.lastName.trim()
                }
              >
                {updateProfile.isPending ? (
                  <Spinner size="sm" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal
        open={openPasswordModal}
        onOpenChange={setOpenPasswordModal}
      />
    </div>
  );
}
