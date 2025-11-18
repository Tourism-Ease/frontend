import { Button } from "../../../../components/ui/Button";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5050/api/v1/auth/google";
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2 cursor-pointer"
      variant="outline"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </Button>
  );
}
