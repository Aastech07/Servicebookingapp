import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 100,
        friction: 6,
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

  const login = () => {
    if (!email.includes('@')) return Alert.alert('Error', 'Please enter a valid email');
    if (password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');
    navigation.replace('Main');
  };

  const emailBorderColor = emailBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8E8E8', '#667EEA'],
  });

  const passwordBorderColor = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8E8E8', '#667EEA'],
  });

  return (
    <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: fadeAnim, transform: [{ scale: logoScale }] },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>👤</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subtitleText}>Sign in to continue</Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <Animated.View
              style={[styles.inputContainer, { borderColor: emailBorderColor }]}
            >
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => {
                  setEmailFocused(true);
                  animateBorder(emailBorderAnim, true);
                }}
                onBlur={() => {
                  setEmailFocused(false);
                  animateBorder(emailBorderAnim, false);
                }}
              />
            </Animated.View>
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <Animated.View
              style={[styles.inputContainer, { borderColor: passwordBorderColor }]}
            >
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                onFocus={() => {
                  setPasswordFocused(true);
                  animateBorder(passwordBorderAnim, true);
                }}
                onBlur={() => {
                  setPasswordFocused(false);
                  animateBorder(passwordBorderAnim, false);
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={login}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>Login</Text>
                <Text style={styles.arrowIcon}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>


        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  eyeIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#667EEA',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  arrowIcon: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#A0A0A0',
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  appleButton: {
    backgroundColor: '#000',
  },
  googleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EA4335',
  },
  appleText: {
    fontSize: 24,
    color: '#FFF',
  },
  facebookText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1877F2',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  signupLink: {
    color: '#667EEA',
    fontWeight: 'bold',
    fontSize: 14,
  },
});