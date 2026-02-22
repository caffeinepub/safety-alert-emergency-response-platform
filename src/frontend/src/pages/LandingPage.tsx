import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Shield, AlertCircle, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const handleCheckSafety = () => {
    if (!isAuthenticated) {
      navigate({ to: '/auth' });
      return;
    }

    if (userProfile?.userType === 'officer') {
      navigate({ to: '/officer-dashboard' });
    } else {
      navigate({ to: '/citizen-dashboard' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-police/10 via-background to-emergency/5 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/generated/safety-shield.dim_256x256.png"
              alt="Safety Shield"
              className="h-32 w-32 drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Your Safety, Our Priority
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect instantly with nearby police officers in emergencies. One tap can save your life. Help is always
            just a moment away.
          </p>
          <Button
            size="lg"
            onClick={handleCheckSafety}
            disabled={isLoading}
            className="text-lg px-8 py-6 bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-emergency"
          >
            <Shield className="mr-2 h-6 w-6" />
            {isLoading ? 'Loading...' : 'Check Here for Safety'}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">How SafeAlert Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emergency/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-emergency" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Alert</h3>
              <p className="text-sm text-muted-foreground">
                Send emergency alerts with one tap when you need help immediately
              </p>
            </div>

            <div className="text-center">
              <div className="bg-police/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-police" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Location</h3>
              <p className="text-sm text-muted-foreground">
                Your exact location is shared with nearby police officers automatically
              </p>
            </div>

            <div className="text-center">
              <div className="bg-safety/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-safety" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quick Response</h3>
              <p className="text-sm text-muted-foreground">
                Officers can call you directly and respond to your location immediately
              </p>
            </div>

            <div className="text-center">
              <div className="bg-warning/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-warning" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-time Chat</h3>
              <p className="text-sm text-muted-foreground">
                Communicate with responding officers through secure messaging
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-police/5 to-emergency/5">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Stay Safe?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of citizens and officers making communities safer every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/auth' })}
              className="bg-police hover:bg-police/90 text-police-foreground"
            >
              <Shield className="mr-2 h-5 w-5" />
              Get Started as Citizen
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/auth' })}
              className="border-police text-police hover:bg-police/10"
            >
              <img src="/assets/generated/police-badge.dim_96x96.png" alt="Badge" className="mr-2 h-5 w-5" />
              Join as Officer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
