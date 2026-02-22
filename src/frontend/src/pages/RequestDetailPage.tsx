import { useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetAllRequests, useCompleteHelpRequest } from '../hooks/useQueries';
import MessageThread from '../components/MessageThread';
import StatusBadge from '../components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Phone, MapPin, User, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Type } from '../backend';

export default function RequestDetailPage() {
  const navigate = useNavigate();
  const { requestId } = useParams({ from: '/request/$requestId' });
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: requests = [] } = useGetAllRequests();
  const completeMutation = useCompleteHelpRequest();

  const request = requests.find((r) => r.id.toString() === requestId);

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/auth' });
    }
  }, [identity, navigate]);

  const handleComplete = async () => {
    if (!request) return;

    try {
      await completeMutation.mutateAsync(request.id);
      toast.success('Request marked as resolved');
    } catch (error: any) {
      toast.error('Failed to complete request', {
        description: error.message || 'Please try again',
      });
    }
  };

  const handleBack = () => {
    if (userProfile?.userType === 'officer') {
      navigate({ to: '/officer-dashboard' });
    } else {
      navigate({ to: '/citizen-dashboard' });
    }
  };

  if (!request) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Request not found</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isOfficer = userProfile?.userType === 'officer';
  const canComplete = isOfficer && request.status === Type.accepted;

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button onClick={handleBack} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl">Emergency Request Details</CardTitle>
                <StatusBadge status={request.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-police/10 rounded-full p-2">
                    <User className="h-5 w-5 text-police" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Citizen Name</p>
                    <p className="font-medium">{request.citizenName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-police/10 rounded-full p-2">
                    <Phone className="h-5 w-5 text-police" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile Number</p>
                    <a
                      href={`tel:${request.citizenMobile}`}
                      className="font-medium text-police hover:underline"
                    >
                      {request.citizenMobile}
                    </a>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <div className="bg-police/10 rounded-full p-2">
                  <img
                    src="/assets/generated/location-pin.dim_64x64.png"
                    alt="Location"
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Emergency Location</p>
                  <p className="font-medium mb-2">
                    Lat: {request.location.latitude.toFixed(6)}, Lng: {request.location.longitude.toFixed(6)}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${request.location.latitude},${request.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-police hover:underline text-sm inline-flex items-center gap-1"
                  >
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              {canComplete && (
                <>
                  <Separator />
                  <Button
                    onClick={handleComplete}
                    disabled={completeMutation.isPending}
                    className="w-full bg-safety hover:bg-safety/90 text-safety-foreground"
                  >
                    {completeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Marking as Resolved...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Resolved
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <MessageThread requestId={request.id} senderName={userProfile?.name || 'User'} />
        </div>
      </div>
    </div>
  );
}
