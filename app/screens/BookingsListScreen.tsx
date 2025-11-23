import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getBookings, deleteBooking } from '../storage/bookings';

interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string;
}

export default function BookingsListScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-50)).current;

  const load = async () => {
    const data = await getBookings();
    setBookings(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => {
    load();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(headerAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDelete = (id: string, serviceName: string) => {
    Alert.alert(
      'Delete Booking',
      `Are you sure you want to delete "${serviceName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBooking(id);
            load();
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: Booking; index: number }) => {
    const scale = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.card}>
          {/* Service Badge */}
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{item.serviceName.charAt(0).toUpperCase()}</Text>
          </LinearGradient>

          {/* Content */}
          <View style={styles.cardContent}>
            <Text style={styles.serviceName}>{item.serviceName}</Text>
            
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeItem}>
                <Text style={styles.dateTimeIcon}>📅</Text>
                <Text style={styles.dateTimeText}>{item.date}</Text>
              </View>
              <View style={styles.dateTimeItem}>
                <Text style={styles.dateTimeIcon}>⏰</Text>
                <Text style={styles.dateTimeText}>{item.time}</Text>
              </View>
            </View>

            {item.notes ? (
              <View style={styles.notesContainer}>
                <Text style={styles.notesIcon}>📝</Text>
                <Text style={styles.notesText}>{item.notes}</Text>
              </View>
            ) : null}
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id, item.serviceName)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const ListHeader = () => (
    <Animated.View
      style={[
        styles.headerContent,
        { transform: [{ translateY: headerAnim }] },
      ]}
    >
      <Text style={styles.headerTitle}>My Bookings</Text>
      <Text style={styles.headerSubtitle}>
        {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} scheduled
      </Text>
    </Animated.View>
  );

  const ListEmpty = () => (
    <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Bookings Yet</Text>
      <Text style={styles.emptySubtitle}>Your scheduled bookings will appear here</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Background */}
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.headerGradient}
      >
        <ListHeader />
      </LinearGradient>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#667EEA"
            colors={['#667EEA', '#764BA2']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  listContent: {
    padding: 16,
    paddingTop: 24,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  badge: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  badgeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  dateTimeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  notesIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#888',
    flex: 1,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
  },
});