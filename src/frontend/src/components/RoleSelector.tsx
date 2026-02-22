import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: 'citizen' | 'officer') => void;
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Your Role</CardTitle>
        <CardDescription>Select how you'll be using SafeAlert</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => onSelectRole('citizen')}
            className="group relative overflow-hidden rounded-lg border-2 border-border hover:border-police transition-all p-6 text-left bg-card hover:bg-police/5"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-police/10 rounded-full p-4 group-hover:bg-police/20 transition-colors">
                <Users className="h-12 w-12 text-police" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Citizen</h3>
                <p className="text-sm text-muted-foreground">
                  Get help in emergencies by sending alerts to nearby police officers
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectRole('officer')}
            className="group relative overflow-hidden rounded-lg border-2 border-border hover:border-emergency transition-all p-6 text-left bg-card hover:bg-emergency/5"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-emergency/10 rounded-full p-4 group-hover:bg-emergency/20 transition-colors">
                <img
                  src="/assets/generated/police-badge.dim_96x96.png"
                  alt="Police Badge"
                  className="h-12 w-12"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Police Officer</h3>
                <p className="text-sm text-muted-foreground">
                  Respond to emergency alerts and help citizens in need
                </p>
              </div>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
