import { useEffect, useRef } from 'react';
import { useGetAllRequests } from '../hooks/useQueries';
import { useNotifications } from '../hooks/useNotifications';
import { Type } from '../backend';

interface NotificationManagerProps {
  userType: 'citizen' | 'officer';
}

export default function NotificationManager({ userType }: NotificationManagerProps) {
  const { data: requests = [] } = useGetAllRequests();
  const { requestPermission, sendNotification, permission } = useNotifications();
  const previousRequestsRef = useRef<string[]>([]);

  useEffect(() => {
    // Request notification permission on mount
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (userType === 'officer') {
      // Check for new pending requests
      const currentPendingIds = requests
        .filter((r) => r.status === Type.pending)
        .map((r) => r.id.toString());

      const newRequests = currentPendingIds.filter(
        (id) => !previousRequestsRef.current.includes(id)
      );

      if (newRequests.length > 0 && previousRequestsRef.current.length > 0) {
        sendNotification('New Emergency Alert!', {
          body: `${newRequests.length} new emergency request(s) received. Immediate response required.`,
          icon: '/assets/generated/emergency-icon.dim_128x128.png',
          tag: 'emergency-alert',
        });
      }

      previousRequestsRef.current = currentPendingIds;
    }
  }, [requests, userType, sendNotification]);

  return null;
}
