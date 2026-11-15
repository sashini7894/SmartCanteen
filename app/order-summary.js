import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useCart } from '../context/CartContext';

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');

  const calculatePrepTime = () => {
    if (cart.length === 0) return 0;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    return 10 + totalItems * 2; 
  };

  const triggerOrderNotification = async (name, deliveryLocation) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Smart Canteen - Order Confirmed! 🍔',
        body: `Hi ${name}, your order is being prepared and will be ready for ${deliveryLocation} in ~${calculatePrepTime()} mins.`,
        sound: true,
      },
      trigger: null, 
    });
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }

    if (!customerName.trim() || !phoneNumber.trim() || !location.trim()) {
      Alert.alert(
        'Missing Details',
        'Please enter your Name, Phone Number, and Location to proceed.'
      );
      return;
    }

    if (phoneNumber.trim().length < 9) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
      return;
    }

    await triggerOrderNotification(customerName.trim(), location.trim());

    Alert.alert(
      'Order Placed Successfully! 🎉',
      `Thank you, ${customerName}!\n\nLocation: ${location}\nPhone: ${phoneNumber}\nEstimated Prep Time: ${calculatePrepTime()} mins`,
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            router.replace('/'); 
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* 1. Customer Details Form */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer Details</Text>

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Sashini Perera"
            value={customerName}
            onChangeText={setCustomerName}
          />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 0771234567"
            keyboardType="phone-pad"
            maxLength={12}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <Text style={styles.label}>Delivery / Pickup Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Science Faculty / Main Canteen Pickup"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* 2. Order Summary Items */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {cart.length === 0 ? (
            <Text style={styles.emptyText}>Your cart is currently empty.</Text>
          ) : (
            cart.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* 3. Bill & Preparation Time */}
        {cart.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Prep Time:</Text>
              <Text style={styles.prepTimeText}>~{calculatePrepTime()} mins</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>Rs. {getTotalPrice().toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* 4. Confirm Order Button */}
        <TouchableOpacity
          style={[styles.orderButton, cart.length === 0 && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={cart.length === 0}
        >
          <Text style={styles.orderButtonText}>Confirm & Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800000',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
    color: '#222222',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  itemQty: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#555',
  },
  prepTimeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D97706',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800000',
  },
  orderButton: {
    backgroundColor: '#800000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});