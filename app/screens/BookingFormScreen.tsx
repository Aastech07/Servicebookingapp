import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import data from '../data/services.json';
import { saveBooking } from '../storage/bookings';
import uuid from 'react-native-uuid';

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
}

export default function BookingFormScreen({ route, navigation }: any) {
  const { serviceId } = route?.params || {};
  const service: Service | undefined = data.find((s) => s.id === serviceId);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [dateFocused, setDateFocused] = useState(false);
  const [timeFocused, setTimeFocused] = useState(false);
  const [notesFocused, setNotesFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const dateBorderAnim = useRef(new Animated.Value(0)).current;
  const timeBorderAnim = useRef(new Animated.Value(0)).current;
  const notesBorderAnim = useRef(new Animated.Value(0)).current;

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

  const animateBorder = (anim: Animated.Value, focused: boolean) => {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

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

  const submit = async () => {
    if (!date || !time) {
      Alert.alert('Error', 'Please enter date & time');
      return;
    }

    await saveBooking({
      id: uuid.v4(),
      serviceId,
      serviceName: service?.name || '',
      date,
      time,
      notes,
    });

    Alert.alert('Success', 'Booking confirmed!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Main', { screen: 'Bookings' }),
      },
    ]);
  };

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Service not found!</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dateBorderColor = dateBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8E8E8', '#667EEA'],
  });

  const timeBorderColor = timeBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8E8E8', '#667EEA'],
  });

  const notesBorderColor = notesBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8E8E8', '#667EEA'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
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
          <Text style={styles.headerTitle}>Book Service</Text>
          <Text style={styles.headerSubtitle}>{service.name}</Text>
        </Animated.View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.formCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Service Info */}
            <View style={styles.serviceInfo}>
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.serviceBadge}
              >
                <Text style={styles.serviceBadgeText}>
                  {service.name.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <View style={styles.serviceMetaRow}>
                  <Text style={styles.serviceMeta}>⏱️ {service.duration}</Text>
                  <Text style={styles.serviceMeta}>💰 ₹{service.price}</Text>
                </View>
              </View>
            </View>

            {/* Date Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>📅 Date</Text>
              <Animated.View
                style={[
                  styles.inputContainer,
                  { borderColor: dateBorderColor },
                ]}
              >
                <TextInput
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#A0A0A0"
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  onFocus={() => {
                    setDateFocused(true);
                    animateBorder(dateBorderAnim, true);
                  }}
                  onBlur={() => {
                    setDateFocused(false);
                    animateBorder(dateBorderAnim, false);
                  }}
                />
              </Animated.View>
              <Text style={styles.hint}>Example: 2024-12-25</Text>
            </View>

            {/* Time Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>⏰ Time</Text>
              <Animated.View
                style={[
                  styles.inputContainer,
                  { borderColor: timeBorderColor },
                ]}
              >
                <TextInput
                  placeholder="HH:MM"
                  placeholderTextColor="#A0A0A0"
                  style={styles.input}
                  value={time}
                  onChangeText={setTime}
                  onFocus={() => {
                    setTimeFocused(true);
                    animateBorder(timeBorderAnim, true);
                  }}
                  onBlur={() => {
                    setTimeFocused(false);
                    animateBorder(timeBorderAnim, false);
                  }}
                />
              </Animated.View>
              <Text style={styles.hint}>Example: 14:30</Text>
            </View>

            {/* Notes Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>📝 Notes (Optional)</Text>
              <Animated.View
                style={[
                  styles.inputContainer,
                  styles.notesContainer,
                  { borderColor: notesBorderColor },
                ]}
              >
                <TextInput
                  placeholder="Any special requirements..."
                  placeholderTextColor="#A0A0A0"
                  style={[styles.input, styles.notesInput]}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={notes}
                  onChangeText={setNotes}
                  onFocus={() => {
                    setNotesFocused(true);
                    animateBorder(notesBorderAnim, true);
                  }}
                  onBlur={() => {
                    setNotesFocused(false);
                    animateBorder(notesBorderAnim, false);
                  }}
                />
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Confirm Button - Fixed at Bottom */}
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
              onPress={submit}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                <Text style={styles.confirmButtonIcon}>✓</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
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
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    margin: 16,
    marginBottom: 100,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8F9FF',
    borderRadius: 16,
  },
  serviceBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  serviceBadgeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  serviceMetaRow: {
    flexDirection: 'row',
  },
  serviceMeta: {
    fontSize: 13,
    color: '#666',
    marginRight: 16,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  notesContainer: {
    minHeight: 100,
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    height: 80,
  },
  hint: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 6,
    marginLeft: 4,
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
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  confirmButtonIcon: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#667EEA',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});