import { Button } from "../../../../components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}

export default function DeactivateAccountModal({ open, onOpenChange, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Deactivate Account?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 mt-2">
          Are you sure you want to deactivate your account?  
          You will no longer be able to log in until you activate it again.
        </p>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            className="cursor-pointer text-white"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Yes, Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
