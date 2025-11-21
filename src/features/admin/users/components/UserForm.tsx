import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "../schema/user.schema";
import type { CreateUserDto, UpdateUserDto } from "../types/user.type";

interface UserFormProps<T extends CreateUserDto | UpdateUserDto> {
  onSubmit: (data: T) => void;
  isLoading?: boolean;
  defaultValues?: Partial<T>;
}

export function UserForm<T extends CreateUserDto | UpdateUserDto>({
  onSubmit,
  isLoading,
  defaultValues,
}: UserFormProps<T>) {
  const isEditMode = !!defaultValues;

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    mode: "onBlur",
    resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema),
    defaultValues: {
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      email: defaultValues?.email || "",
      phone: (defaultValues as any)?.phone || "",
      role: defaultValues?.role || "user",
      active: (defaultValues as any)?.active ?? true,
      password: "",
    },
  });

  const handleFormSubmit = (values: CreateUserFormData | UpdateUserFormData) => {
    // Show loading toast for form submission
    const loadingToast = toast.loading(
      isEditMode ? "Updating user..." : "Creating user..."
    );

    try {
      // Remove password if empty in edit mode
      if (isEditMode && !values.password) {
        const { password, ...rest } = values;
        onSubmit(rest as T);
      } else {
        onSubmit(values as T);
      }
      
      // Toast will be updated by the mutation hook
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Form submission failed", {
        description: "Please check your inputs and try again.",
      });
    }
  };

  const handleFormError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error("Validation Error", {
        description: firstError.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleFormSubmit, handleFormError)} 
        className="space-y-6"
      >
        {/* First Name + Last Name in same row */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} placeholder="First Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} placeholder="Last Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Email" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password (create only) */}
        {!isEditMode && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Password" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Phone Number (optional)" 
                  onChange={(e) => {
                    field.onChange(e);
                    // Show info toast for phone field
                    if (e.target.value.trim() === '') {
                      toast.info('Phone number cleared', {
                        description: 'Phone number will not be saved',
                        duration: 2000,
                      });
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role + Active in same row */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Active (edit only) */}
          {isEditMode && (
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex-1 flex items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        toast.info(
                          checked ? "User activated" : "User deactivated",
                          { duration: 2000 }
                        );
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <label>Active User</label>
                  </div>
                </FormItem>
              )}
            />
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEditMode ? "Update User" : "Create User"
          )}
        </Button>
      </form>
    </Form>
  );
}