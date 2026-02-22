import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import EmergencyAlertButton from '../components/EmergencyAlertButton';
import NotificationManager from '../components/NotificationManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/auth' });
    } else if (userProfile && userProfile.userType === 'officer') {
      navigate({ to: '/officer-dashboard' });
    }
  }, [identity, userProfile, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-police" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 px-4">
      <NotificationManager userType="citizen" />
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {userProfile?.name}</h1>
          <p className="text-muted-foreground">Your safety is our priority. Use the button below in case of emergency.</p>
        </div>

        <div className="grid gap-6">
          <Card className="border-emergency/20 bg-gradient-to-br from-emergency/5 to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emergency">
                <AlertCircle className="h-6 w-6" />
                Emergency Alert
              </CardTitle>
              <CardDescription>
                Press the button below to send your location to nearby police officers immediately
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <EmergencyAlertButton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-police/10 flex items-center justify-center text-police font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Press Emergency Alert</h3>
                  <p className="text-sm text-muted-foreground">
                    When you need help, press the emergency button above
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-police/10 flex items-center justify-center text-police font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Share Your Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow location access so officers know where to find you
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-police/10 flex items-center justify-center text-police font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Help Is On The Way</h3>
                  <p className="text-sm text-muted-foreground">
                    Nearby officers will receive your alert and respond immediately
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
