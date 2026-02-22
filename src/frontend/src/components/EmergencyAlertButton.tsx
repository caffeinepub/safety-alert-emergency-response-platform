import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSendSosRequest } from '../hooks/useQueries';
import { useGeolocation } from '../hooks/useGeolocation';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import LocationPermissionModal from './LocationPermissionModal';

export default function EmergencyAlertButton() {
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { requestLocation, isLoading: locationLoading } = useGeolocation();
  const sendSosMutation = useSendSosRequest();

  const handleEmergencyClick = () => {
    setShowLocationModal(true);
  };

  const handleLocationGranted = async () => {
    setShowLocationModal(false);
    
    try {
      const location = await requestLocation();
      const requestId = await sendSosMutation.mutateAsync(location);
      
      toast.success('Emergency alert sent successfully!', {
        description: 'Nearby officers have been notified of your location.',
      });

      // Navigate to request detail page
      navigate({ to: '/request/$requestId', params: { requestId: requestId.toString() } });
    } catch (error: any) {
      toast.error('Failed to send emergency alert', {
        description: error.message || 'Please try again',
      });
    }
  };

  const handleLocationDenied = () => {
    setShowLocationModal(false);
    toast.error('Location access required', {
      description: 'Please enable location access to send emergency alerts.',
    });
  };

  const isLoading = locationLoading || sendSosMutation.isPending;

  return (
    <>
      <Button
        size="lg"
        onClick={handleEmergencyClick}
        disabled={isLoading}
        className="h-48 w-48 rounded-full bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-emergency emergency-pulse text-xl font-bold"
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-12 w-12 animate-spin" />
            <span className="text-sm">Sending...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img
              src="/assets/generated/emergency-icon.dim_128x128.png"
              alt="Emergency"
              className="h-16 w-16"
            />
            <span>EMERGENCY</span>
          </div>
        )}
      </Button>

      <LocationPermissionModal
        open={showLocationModal}
        onOpenChange={setShowLocationModal}
        onGrant={handleLocationGranted}
        onDeny={handleLocationDenied}
      />
    </>
  );
}
