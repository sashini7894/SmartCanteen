import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { CartProvider } from '../context/CartContext';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Please enable notifications to receive order pickup alerts!');
      }
    }
    requestPermissions();
  }, []);

  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#800000' }, 
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'Smart Canteen' }}
        />
        <Stack.Screen
          name="order-summary"
          options={{ title: 'Order Summary & Checkout' }}
        />
      </Stack>
    </CartProvider>
  );
}