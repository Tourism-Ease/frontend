import { Label } from "@radix-ui/react-dropdown-menu";
import { X } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useLogin } from "../hooks/useLogin";
import GoogleLoginButton from "./GoogleLoginButton";
import coverImage from "../../../../assets/images/login-cover.jpg";

type LoginModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function LoginModalSideFull({ isOpen, setIsOpen }: LoginModalProps) {
  const { form, onSubmit, isLoading } = useLogin();
  const { register: registerField, handleSubmit, formState: { errors } } = form;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-background w-full max-w-4xl rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hidden md:block md:w-1/2 h-80 md:h-auto">
          <img src={coverImage} alt="Login Cover" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-6 relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...registerField("email")} />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...registerField("password")} />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>

            <Button type="submit" className="mt-2" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="px-2 text-gray-400 text-sm">or</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <GoogleLoginButton />

          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Button variant="link" onClick={() => setIsOpen(false)}>Sign up</Button>
          </p>
        </div>
      </div>
    </div>
  );
}
