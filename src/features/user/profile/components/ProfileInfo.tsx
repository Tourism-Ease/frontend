import { useEffect, useState } from "react";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import type { UpdateProfileInput, UserProfile } from "../types";
import ChangePasswordModal from "./ChangePasswordModal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { toast } from "sonner";

export default function ProfileInfo() {
  const { data: user } = useProfile();
  const updateProfile = useUpdateProfile();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);

  const [form, setForm] = useState<UpdateProfileInput>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: null,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      profileImage: null,
    });
    setSelectedImage(null);
    setImagePreview(null);
  }, [user]);

  const handleChange =
    (field: keyof UpdateProfileInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "profileImage") {
        const file = e.target.files?.[0] || null;
        setSelectedImage(file);
        setForm({ ...form, profileImage: file });

        // Create preview URL
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setImagePreview(null);
        }
      } else {
        setForm({ ...form, [field]: e.target.value });
      }
    };

  const handleSave = (): void => {
    updateProfile.mutate(form, {
      onSuccess: () => {
        setEditMode(false);
        setSelectedImage(null);
        setImagePreview(null);
        toast.success("Profile updated successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  const getInitials = (user: UserProfile): string => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* AVATAR */}
      <div className="flex items-center gap-5">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={imagePreview || user.avatar || undefined}
            alt="Profile"
          />
          <AvatarFallback className="text-lg font-semibold">
            {getInitials(user)}
          </AvatarFallback>
        </Avatar>
        {editMode && (
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleChange("profileImage")}
              className="border p-2 rounded text-sm"
              id="profile-image"
            />
            <label htmlFor="profile-image" className="text-sm text-gray-600">
              Choose new profile image
            </label>
          </div>
        )}
      </div>

      {/* FORM FIELDS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input
            disabled={!editMode}
            value={form.firstName}
            onChange={handleChange("firstName")}
          />
        </div>

        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input
            disabled={!editMode}
            value={form.lastName}
            onChange={handleChange("lastName")}
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>Email</Label>
          <Input disabled value={form.email} />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>Phone</Label>
          <Input
            disabled={!editMode}
            value={form.phone}
            onChange={handleChange("phone")}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setOpenPasswordModal(true)}>
          Change Password
        </Button>

        {!editMode ? (
          <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
        ) : (
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setEditMode(false);
                setSelectedImage(null);
                setImagePreview(null);
                // Reset form to original values
                if (user) {
                  setForm({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone || "",
                    profileImage: null,
                  });
                }
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      <ChangePasswordModal
        open={openPasswordModal}
        onOpenChange={setOpenPasswordModal}
      />
    </div>
  );
}
