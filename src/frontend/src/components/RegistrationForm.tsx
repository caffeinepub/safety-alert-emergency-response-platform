import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRegister } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';

interface RegistrationFormProps {
  userType: 'citizen' | 'officer';
}

export default function RegistrationForm({ userType }: RegistrationFormProps) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!mobile.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }

    // Basic mobile number validation
    const mobileRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    try {
      await registerMutation.mutateAsync({ name, mobile, userType });
      toast.success('Registration successful!');
      
      // Navigate to appropriate dashboard
      if (userType === 'officer') {
        navigate({ to: '/officer-dashboard' });
      } else {
        navigate({ to: '/citizen-dashboard' });
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {userType === 'officer' ? (
            <img src="/assets/generated/police-badge.dim_96x96.png" alt="Badge" className="h-8 w-8" />
          ) : (
            <Users className="h-8 w-8 text-police" />
          )}
          <CardTitle className="text-2xl">Complete Registration</CardTitle>
        </div>
        <CardDescription>
          {userType === 'officer'
            ? 'Enter your details to start responding to emergencies'
            : 'Enter your details to access emergency services'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="+1 234 567 8900"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-police hover:bg-police/90 text-police-foreground"
              size="lg"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registering...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
