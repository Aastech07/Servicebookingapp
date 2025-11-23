import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
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

export default function ServiceDetailsScreen({ route, navigation }: any) {
  const { serviceId } = route.params;
  const service: Service | undefined = data.find((s) => s.id === serviceId);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  if (!service) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Service not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with Gradient */}
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.serviceBadge}>
            <Text style={styles.badgeText}>
              {service.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.headerTitle}>{service.name}</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Cards */}
        <Animated.View
          style={[
            styles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{service.duration}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>💰</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>₹{service.price}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Description Section */}
        {service.description && (
          <Animated.View
            style={[
              styles.descriptionCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.descriptionTitle}>📋 Description</Text>
            <Text style={styles.descriptionText}>{service.description}</Text>
          </Animated.View>
        )}

        {/* Features Section */}
        <Animated.View
          style={[
            styles.featuresCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.featuresTitle}>✨ What's Included</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Professional Service</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Quality Guaranteed</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Flexible Timing</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Expert Staff</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Book Button - Fixed at Bottom */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('BookingForm', { serviceId })}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bookButton}
            >
              <Text style={styles.bookButtonText}>Book Service</Text>
              <Text style={styles.bookButtonIcon}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  headerContent: {
    alignItems: 'center',
  },
  serviceBadge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  badgeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#667EEA',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  descriptionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  featuresCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 100,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 16,
    color: '#667EEA',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: '#666',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  bookButtonIcon: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 100,
  },
});