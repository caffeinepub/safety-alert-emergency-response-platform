import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import RoleSelector from '../components/RoleSelector';
import RegistrationForm from '../components/RegistrationForm';

export default function AuthPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus, isLoggingIn } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'officer' | null>(null);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      // User is authenticated and has a profile, redirect to appropriate dashboard
      if (userProfile.userType === 'officer') {
        navigate({ to: '/officer-dashboard' });
      } else {
        navigate({ to: '/citizen-dashboard' });
      }
    }
  }, [isAuthenticated, userProfile, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const showRoleSelection = isAuthenticated && !profileLoading && isFetched && userProfile === null && !selectedRole;
  const showRegistrationForm = isAuthenticated && selectedRole !== null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-police" />
            </div>
            <CardTitle className="text-2xl">Welcome to SafeAlert</CardTitle>
            <CardDescription>Sign in to access emergency response services</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-police hover:bg-police/90 text-police-foreground"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Sign In with Internet Identity
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showRoleSelection) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <RoleSelector onSelectRole={setSelectedRole} />
      </div>
    );
  }

  if (showRegistrationForm && selectedRole) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <RegistrationForm userType={selectedRole} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-police" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
