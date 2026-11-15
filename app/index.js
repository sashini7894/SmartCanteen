import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  AppState,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MENU_ITEMS } from '../data/menuData';
import { useCart } from '../context/CartContext.js';

export default function MenuScreen() {
  const router = useRouter();
  const { cart, addToCart, getTotalPrice } = useCart();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietFilter, setDietFilter] = useState('All'); // 'All', 'Veg', 'Non-Veg'

  // AppState Tracking (Foreground / Background)
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        
        setLastRefreshed(new Date().toLocaleTimeString());
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const filteredMenu = MENU_ITEMS.filter((item) => {
    const categoryMatch =
      selectedCategory === 'All' || item.category === selectedCategory;
    const dietMatch =
      dietFilter === 'All' ||
      (dietFilter === 'Veg' && item.isVeg) ||
      (dietFilter === 'Non-Veg' && !item.isVeg);
    return categoryMatch && dietMatch;
  });

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderMenuItem = ({ item }) => {
    const cartItem = cart.find((c) => c.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            {/* Veg / Non-Veg Indicator */}
            <View
              style={[
                styles.dietBadge,
                { borderColor: item.isVeg ? '#2e7d32' : '#c62828' },
              ]}
            >
              <View
                style={[
                  styles.dietDot,
                  { backgroundColor: item.isVeg ? '#2e7d32' : '#c62828' },
                ]}
              />
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
          <Text style={styles.itemPrice}>Rs. {item.price}</Text>
        </View>

        <Text style={styles.itemDesc}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.prepTime}>
            <Ionicons name="time-outline" size={14} color="#666" /> ~{item.prepTime} mins
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addButtonText}>
              {quantity > 0 ? `Added (${quantity}) +` : '+ Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppState Live Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          🟢 Canteen Open • State: {appStateVisible.toUpperCase()} • Synced: {lastRefreshed}
        </Text>
      </View>

      {/* Category Filter Tabs */}
      <View style={styles.filterSection}>
        <View style={styles.row}>
          {['All', 'Meals', 'Drinks', 'Snacks'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                selectedCategory === cat && styles.activeChip,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === cat && styles.activeChipText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Veg / Non-Veg Filter Buttons */}
        <View style={[styles.row, { marginTop: 8 }]}>
          {['All', 'Veg', 'Non-Veg'].map((diet) => (
            <TouchableOpacity
              key={diet}
              style={[
                styles.dietChip,
                dietFilter === diet && styles.activeDietChip,
              ]}
              onPress={() => setDietFilter(diet)}
            >
              <Text
                style={[
                  styles.dietChipText,
                  dietFilter === diet && styles.activeDietChipText,
                ]}
              >
                {diet === 'Veg' ? '🌿 Veg Only' : diet === 'Non-Veg' ? '🍗 Non-Veg' : '🍽️ All Types'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Menu List */}
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Bottom View Order Summary Bar */}
      {totalCartItems > 0 && (
        <TouchableOpacity
          style={styles.cartBanner}
          onPress={() => router.push('/order-summary')}
        >
          <View>
            <Text style={styles.cartBannerTitle}>
              {totalCartItems} {totalCartItems === 1 ? 'Item' : 'Items'} Selected
            </Text>
            <Text style={styles.cartBannerSub}>Total: Rs. {getTotalPrice()}</Text>
          </View>
          <View style={styles.viewCartBtn}>
            <Text style={styles.viewCartText}>Order Summary →</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  statusBar: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#c8e6c9',
  },
  statusText: { fontSize: 11, color: '#2e7d32', fontWeight: '600', textAlign: 'center' },
  filterSection: { backgroundColor: '#fff', padding: 12, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeChip: { backgroundColor: '#800000' },
  chipText: { fontSize: 13, color: '#333', fontWeight: '600' },
  activeChipText: { color: '#fff' },
  dietChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeDietChip: { backgroundColor: '#333', borderColor: '#333' },
  dietChipText: { fontSize: 12, color: '#444', fontWeight: '600' },
  activeDietChipText: { color: '#fff' },
  listContent: { padding: 12, paddingBottom: 90 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dietBadge: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dietDot: { width: 8, height: 8, borderRadius: 4 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#222', flexShrink: 1 },
  itemPrice: { fontSize: 15, fontWeight: 'bold', color: '#800000' },
  itemDesc: { fontSize: 13, color: '#666', marginVertical: 6 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  prepTime: { fontSize: 12, color: '#666' },
  addButton: {
    backgroundColor: '#800000',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  cartBanner: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  cartBannerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cartBannerSub: { color: '#e8f5e9', fontSize: 13 },
  viewCartBtn: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  viewCartText: { color: '#2e7d32', fontWeight: 'bold', fontSize: 13 },
});