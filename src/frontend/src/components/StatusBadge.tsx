import { Badge } from '@/components/ui/badge';
import { Type } from '../backend';

interface StatusBadgeProps {
  status: Type;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: Type) => {
    switch (status) {
      case Type.pending:
        return {
          label: 'Pending',
          className: 'bg-warning/20 text-warning border-warning/30',
        };
      case Type.accepted:
        return {
          label: 'Accepted',
          className: 'bg-safety/20 text-safety border-safety/30',
        };
      case Type.resolved:
        return {
          label: 'Resolved',
          className: 'bg-police/20 text-police border-police/30',
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-muted text-muted-foreground',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
