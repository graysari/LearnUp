
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
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useUser();

    const handleLogin = async () => {
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

            const data = await loginUser(
                username.trim(),
                password
            );

            login(data.user, data.token);

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
        >
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F8FAFC"
            />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainContent}>

                    <View style={styles.headerContainer}>
                        <View style={styles.logoContainer}>
                            <Ionicons
                                name="school-outline"
                                size={42}
                                color="#6366F1"
                            />
                        </View>

                        <Text style={styles.title}>LearnUp</Text>
                        <Text style={styles.subtitle}>
                            Welcome back! Let's keep learning.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>
                            Sign in
                        </Text>

                        <Text style={styles.formSubtitle}>
                            Enter your account details to continue.
                        </Text>

                        <Text style={styles.inputLabel}>
                            Username
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
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

                        <Text style={[styles.inputLabel, { marginTop: 20 }]}>
                            Password
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
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
                                onPress={() => setShowPassword(prev => !prev)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#94A3B8"
                                />
                            </Pressable>
                        </View>

                        <Pressable
                            style={styles.forgotLink}
                            onPress={() => navigation.navigate('ForgetPassword')}
                        >
                            <Text style={styles.linkText}>
                                Forgot password?
                            </Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                (pressed || loading) && styles.buttonPressed
                            ]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Sign In
                                </Text>
                            )}
                        </Pressable>

                        <View style={styles.registerRow}>
                            <Text style={styles.registerText}>
                                Don't have an account?{' '}
                            </Text>

                            <Pressable
                                onPress={() => navigation.navigate('CreateAccount')}
                            >
                                <Text style={styles.linkText}>
                                    Create account
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <Text style={styles.footerText}>
                    Learn • Practice • Improve
                </Text>
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
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 30,
        justifyContent: 'center',
    },
    mainContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logoContainer: {
        width: 82,
        height: 82,
        backgroundColor: '#EEF2FF',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1E293B',
    },
    subtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 7,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    formTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 5,
    },
    formSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 25,
    },
    inputLabel: {
        fontSize: 13,
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
        paddingHorizontal: 14,
        gap: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 14,
        color: '#1E293B',
        paddingVertical: 0,
    },
    forgotLink: {
        alignSelf: 'flex-end',
        marginTop: 14,
    },
    linkText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6366F1',
    },
    button: {
        backgroundColor: '#6366F1',
        height: 54,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    registerText: {
        color: '#64748B',
        fontSize: 13,
    },
    footerText: {
        color: '#94A3B8',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 35,
    },
});
