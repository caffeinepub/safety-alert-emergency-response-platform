import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetAllRequests } from '../hooks/useQueries';
import NotificationManager from '../components/NotificationManager';
import HelpRequestCard from '../components/HelpRequestCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle } from 'lucide-react';
import { Type } from '../backend';

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: requests = [], isLoading: requestsLoading } = useGetAllRequests();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/auth' });
    } else if (userProfile && userProfile.userType !== 'officer') {
      navigate({ to: '/citizen-dashboard' });
    }
  }, [identity, userProfile, navigate]);

  if (profileLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-police" />
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === Type.pending);
  const acceptedRequests = requests.filter((r) => r.status === Type.accepted);
  const resolvedRequests = requests.filter((r) => r.status === Type.resolved);

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 px-4">
      <NotificationManager userType="officer" />
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Officer Dashboard</h1>
          <p className="text-muted-foreground">Welcome, Officer {userProfile?.name}. Monitor and respond to emergency alerts.</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingRequests.length > 0 && (
                <span className="ml-2 bg-emergency text-emergency-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Active
              {acceptedRequests.length > 0 && (
                <span className="ml-2 bg-warning text-warning-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                  {acceptedRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {requestsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-police" />
              </div>
            ) : pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending emergency requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => <HelpRequestCard key={request.id.toString()} request={request} />)
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {requestsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-police" />
              </div>
            ) : acceptedRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active emergency requests</p>
                </CardContent>
              </Card>
            ) : (
              acceptedRequests.map((request) => <HelpRequestCard key={request.id.toString()} request={request} />)
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {requestsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-police" />
              </div>
            ) : resolvedRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No resolved emergency requests</p>
                </CardContent>
              </Card>
            ) : (
              resolvedRequests.map((request) => <HelpRequestCard key={request.id.toString()} request={request} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
