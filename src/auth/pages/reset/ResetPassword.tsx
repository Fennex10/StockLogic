import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ResetPassword = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const pwd = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (!pwd || pwd.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (pwd !== confirm) {
      toast.error("Passwords don't match");
      return;
    }

    setIsPosting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setDone(true);
    setIsPosting(false);
  };

  if (done) {
    return (
     
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <Link to="/login">
            <Button className="w-full h-11 rounded-xl auth-gradient text-primary-foreground hover:opacity-90">
              Continue to sign in
            </Button>
          </Link>
        </div>
    );
  }

  return (
   
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl pr-20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
         
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              required
              className="h-11 rounded-xl pr-20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPosting}
          className="w-full h-11 rounded-xl auth-gradient text-primary-foreground hover:opacity-90"
        >
          {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPosting ? "Resetting..." : "Reset password"}
        </Button>
      </form>
  );
};
