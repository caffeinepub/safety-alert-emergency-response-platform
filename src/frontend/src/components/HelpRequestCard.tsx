import { useNavigate } from '@tanstack/react-router';
import { useAcceptHelpRequest } from '../hooks/useQueries';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from './StatusBadge';
import type { HelpRequest } from '../backend';
import { Type } from '../backend';

interface HelpRequestCardProps {
  request: HelpRequest;
}

export default function HelpRequestCard({ request }: HelpRequestCardProps) {
  const navigate = useNavigate();
  const acceptMutation = useAcceptHelpRequest();

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync(request.id);
      toast.success('Request accepted', {
        description: 'You can now respond to this emergency.',
      });
    } catch (error: any) {
      toast.error('Failed to accept request', {
        description: error.message || 'Please try again',
      });
    }
  };

  const handleViewDetails = () => {
    navigate({ to: '/request/$requestId', params: { requestId: request.id.toString() } });
  };

  const formatTimestamp = (timestamp: bigint) => {
    // Since timestamp is 0 in the backend, we'll show "Just now"
    return 'Just now';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{request.citizenName}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              {formatTimestamp(request.timestamp)}
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <a
            href={`tel:${request.citizenMobile}`}
            className="text-police hover:underline font-medium"
          >
            {request.citizenMobile}
          </a>
        </div>
        <div className="flex items-start gap-2">
          <img
            src="/assets/generated/location-pin.dim_64x64.png"
            alt="Location"
            className="h-4 w-4 mt-0.5 flex-shrink-0"
          />
          <div className="text-sm">
            <p className="font-medium">Location:</p>
            <p className="text-muted-foreground">
              Lat: {request.location.latitude.toFixed(6)}, Lng: {request.location.longitude.toFixed(6)}
            </p>
            <a
              href={`https://www.google.com/maps?q=${request.location.latitude},${request.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-police hover:underline text-xs"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {request.status === Type.pending && (
          <Button
            onClick={handleAccept}
            disabled={acceptMutation.isPending}
            className="flex-1 bg-safety hover:bg-safety/90 text-safety-foreground"
          >
            {acceptMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept Request
              </>
            )}
          </Button>
        )}
        <Button onClick={handleViewDetails} variant="outline" className="flex-1">
          <MessageSquare className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
