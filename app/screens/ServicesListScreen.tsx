import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import data from '../data/services.json';

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
  description?: string;
}

export default function ServicesListScreen({ navigation }: any) {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-50)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setServices(data);
    setFilteredServices(data);
    
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
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  const renderItem = ({ item, index }: { item: Service; index: number }) => {
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
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ServiceDetails', { serviceId: item.id })}
        >
          {/* Service Icon Badge */}
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBadge}
          >
            <Text style={styles.iconText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>

          {/* Content */}
          <View style={styles.cardContent}>
            <Text style={styles.serviceName}>{item.name}</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⏱️</Text>
                <Text style={styles.infoText}>{item.duration}</Text>
              </View>
              
              <View style={styles.priceTag}>
                <Text style={styles.priceSymbol}>₹</Text>
                <Text style={styles.priceText}>{item.price}</Text>
              </View>
            </View>
          </View>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerWrapper}>
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.headerGradient} 
      >
        <Animated.View
          style={[
            styles.headerContent,
            { transform: [{ translateY: headerAnim }] },
          ]}
        >
          <Text style={styles.headerTitle}>Our Services</Text>
          <Text style={styles.headerSubtitle}>
            {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} available
          </Text>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              opacity: searchAnim,
              transform: [{
                translateY: searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          <TextInput
            placeholder="Search services..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </LinearGradient>
    </View>
  );

  const ListEmpty = () => (
    <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>No Services Found</Text>
      <Text style={styles.emptySubtitle}>Try a different search term</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerWrapper: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
  },
  clearIcon: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    padding: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  cardContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 24,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EDFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceSymbol: {
    fontSize: 12,
    color: '#667EEA',
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    color: '#667EEA',
    fontWeight: 'bold',
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 18,
    color: '#667EEA',
    fontWeight: 'bold',
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