import { useState, useCallback } from 'react';
import type { Location } from '../backend';

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const requestLocation = useCallback(async (): Promise<Location> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = 'Geolocation is not supported by your browser';
        setError(errorMsg);
        setIsLoading(false);
        reject(new Error(errorMsg));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(loc);
          setPermissionState('granted');
          setIsLoading(false);
          resolve(loc);
        },
        (err) => {
          let errorMsg = 'Unable to retrieve your location';
          if (err.code === err.PERMISSION_DENIED) {
            errorMsg = 'Location permission denied. Please enable location access to send emergency alerts.';
            setPermissionState('denied');
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is unavailable.';
          } else if (err.code === err.TIMEOUT) {
            errorMsg = 'Location request timed out.';
          }
          setError(errorMsg);
          setIsLoading(false);
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return {
    location,
    error,
    isLoading,
    permissionState,
    requestLocation,
  };
}
