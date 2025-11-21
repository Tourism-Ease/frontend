import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { Spinner } from "../../../../components/ui/Spinner";
import { useState } from "react";

interface ReactivateAccountModalProps {
  isOpen: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  userEmail?: string;
}

export default function ReactivateAccountModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
  userEmail = ""
}: ReactivateAccountModalProps) {
  const [password, setPassword] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">Account Deactivated</h2>
              <p className="text-sm text-gray-600 mt-2">
                The account {userEmail ? `for ${userEmail}` : ''} is currently deactivated.
                Enter your password to reactivate it and log in.
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded px-3 py-2"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setPassword("");
                  onCancel();
                }}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => onConfirm(password)}
                disabled={isLoading || !password}
                className="flex-1"
              >
                {isLoading ? <Spinner size="sm" /> : "Reactivate Account"}
              </Button>
            </div>

            {isLoading && (
              <p className="text-xs text-center text-gray-500">
                Reactivating your account...
              </p>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
