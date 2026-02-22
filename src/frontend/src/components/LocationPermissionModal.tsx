import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGrant: () => void;
  onDeny: () => void;
}

export default function LocationPermissionModal({
  open,
  onOpenChange,
  onGrant,
  onDeny,
}: LocationPermissionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-police/10 rounded-full p-4">
              <img
                src="/assets/generated/location-pin.dim_64x64.png"
                alt="Location"
                className="h-12 w-12"
              />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">Location Access Required</DialogTitle>
          <DialogDescription className="text-center">
            Allow location access to check where you are. This helps nearby police officers find and assist you quickly
            in an emergency.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={onGrant}
            className="w-full bg-police hover:bg-police/90 text-police-foreground"
            size="lg"
          >
            <MapPin className="mr-2 h-5 w-5" />
            Allow Location Access
          </Button>
          <Button onClick={onDeny} variant="outline" className="w-full" size="lg">
            Deny
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
