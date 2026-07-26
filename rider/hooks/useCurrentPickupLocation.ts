import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { useRide } from '@/hooks/useRide';

function formatAddress(address: Location.LocationGeocodedAddress) {
  if (address.formattedAddress) return address.formattedAddress;

  return [address.name, address.street, address.district, address.city, address.region]
    .filter(Boolean)
    .join(', ');
}

export function useCurrentPickupLocation() {
  const { ride, setPickup } = useRide();
  const hasRequestedLocation = useRef(false);
  const [pickupText, setPickupText] = useState('Getting current location...');
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if (hasRequestedLocation.current || ride.pickup) {
      if (ride.pickup) {
        setPickupText(ride.pickup.address);
        setIsLocating(false);
      }
      return;
    }

    hasRequestedLocation.current = true;

    async function loadCurrentLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setPickupText('Location permission denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        let address = 'Current location';

        // Reverse geocoding is removed on Expo Web SDK 49+
        if (Platform.OS !== 'web') {
          try {
            const [reverseGeocodedAddress] = await Location.reverseGeocodeAsync({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            });
            address = reverseGeocodedAddress ? formatAddress(reverseGeocodedAddress) || address : address;
          } catch {
            address = `${currentLocation.coords.latitude.toFixed(5)}, ${currentLocation.coords.longitude.toFixed(5)}`;
          }
        }

        setPickup({
          address,
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setPickupText(address);
      } catch {
        setPickupText('Unable to get current location');
      } finally {
        setIsLocating(false);
      }
    }

    loadCurrentLocation();
  }, [ride.pickup, setPickup]);

  return { pickupText, isLocating };
}
