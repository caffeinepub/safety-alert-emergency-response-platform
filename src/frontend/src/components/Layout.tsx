import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, User } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { SiCaffeine } from 'react-icons/si';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { identity, clear, isLoggingIn } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleDashboardClick = () => {
    if (userProfile?.userType === 'officer') {
      navigate({ to: '/officer-dashboard' });
    } else {
      navigate({ to: '/citizen-dashboard' });
    }
  };

  const isOnLanding = routerState.location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src="/assets/generated/safety-shield.dim_256x256.png" alt="Safety Shield" className="h-10 w-10" />
            <div className="flex flex-col items-start">
              <h1 className="text-xl font-bold text-foreground">SafeAlert</h1>
              <p className="text-xs text-muted-foreground">Emergency Response Platform</p>
            </div>
          </button>

          <nav className="flex items-center gap-3">
            {isAuthenticated && userProfile && (
              <>
                <Button variant="ghost" size="sm" onClick={handleDashboardClick} className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{userProfile.name}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingIn}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
            {!isAuthenticated && !isOnLanding && (
              <Button onClick={() => navigate({ to: '/auth' })} size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SafeAlert. All rights reserved.</p>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Built with <SiCaffeine className="h-4 w-4 text-emergency" /> using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
