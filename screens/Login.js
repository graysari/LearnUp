
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';

import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { loginUser } from '../services/userApi';

export default function Login({ navigation }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // New states
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Your existing UserContext
  const { login } = useUser();

  const handleLogin = async () => {

    // Prevent multiple login requests
    if (loading) return;

    if (!username.trim() || !password) {
      Alert.alert(
        'Missing information',
        'Please enter your username and password.'
      );
      return;
    }

    try {
      setLoading(true);

      // Your existing API function
      const data = await loginUser(
        username.trim(),
        password
      );

      // Your existing session logic
      login(data.user, data.token);
      

      Alert.alert('Login successful');

      // Your existing navigation
      navigation.replace('Home');

    } catch (error) {
      Alert.alert(
        'Login error',
        error.message || 'Unable to log in.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        <View style={styles.mainContent}>

          {/* Logo and App Name */}
          <View style={styles.headerContainer}>

            <View style={styles.logoContainer}>
              <Ionicons
                name="school-outline"
                size={48}
                color="#6366F1"
              />
            </View>

            <Text style={styles.title}>
              LearnUp
            </Text>

            <Text style={styles.subtitle}>
              Welcome back! Let's keep learning.
            </Text>

          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>

            <Text style={styles.inputLabel}>
              Username
            </Text>

            <View style={styles.inputContainer}>

              <Ionicons
                name="person-outline"
                size={21}
                color="#94A3B8"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#94A3B8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

            </View>

            <Text
              style={[
                styles.inputLabel,
                { marginTop: 22 }
              ]}
            >
              Password
            </Text>

            <View style={styles.inputContainer}>

              <Ionicons
                name="lock-closed-outline"
                size={21}
                color="#94A3B8"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />

              <Pressable
                onPress={() =>
                  setShowPassword(!showPassword)
                }
                disabled={loading}
              >
                <Ionicons
                  name={
                    showPassword
                      ? 'eye-outline'
                      : 'eye-off-outline'
                  }
                  size={21}
                  color="#94A3B8"
                />
              </Pressable>

            </View>

            {/* Login Button */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                (pressed || loading) &&
                styles.buttonPressed
              ]}
              onPress={handleLogin}
              disabled={loading}
            >

              {loading ? (

                <View style={styles.loadingContainer}>

                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />

                  <Text style={styles.buttonText}>
                    Logging in...
                  </Text>

                </View>

              ) : (

                <Text style={styles.buttonText}>
                  LOGIN
                </Text>

              )}

            </Pressable>

          </View>

        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Learn • Practice • Improve
          </Text>
        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 30,
    paddingBottom: 40,
  },

  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 420,
  },
  // Logo and title

  headerContainer: {
    alignItems: 'center',
    marginBottom: 55,
  },

  logoContainer: {
    width: 90,
    height: 90,
    backgroundColor: '#E7E9FF',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },

  // Login form

  formContainer: {
    width: '100%',
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 9,
  },

  inputContainer: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 12,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 0,
  },

  // Login button

  button: {
    backgroundColor: '#6366F1',
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    elevation: 3,
    shadowColor: '#6366F1',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Footer

  footerContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 12,
  },

  footerText: {
    color: '#94A3B8',
    fontSize: 12,
  },

});
