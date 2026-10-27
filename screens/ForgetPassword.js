
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ForgetPassword({ navigation }) {
    const [username, setUsername] = useState('');

    const handleRecovery = () => {
        if (!username.trim()) {
            Alert.alert(
                'Missing information',
                'Please enter your username.'
            );
            return;
        }

        Alert.alert(
            'Recovery not connected',
            'Password recovery requires a verified recovery method and backend endpoint.'
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={22}
                        color="#334155"
                    />
                </Pressable>

                <View style={styles.mainContent}>
                    <View style={styles.iconBox}>
                        <Ionicons
                            name="lock-open-outline"
                            size={38}
                            color="#6366F1"
                        />
                    </View>

                    <Text style={styles.title}>
                        Forgot Password?
                    </Text>

                    <Text style={styles.subtitle}>
                        Enter your username to begin account recovery.
                    </Text>

                    <Text style={styles.label}>
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
                        />
                    </View>

                    <Pressable
                        style={styles.button}
                        onPress={handleRecovery}
                    >
                        <Text style={styles.buttonText}>
                            Continue
                        </Text>
                    </Pressable>

                    <Pressable
                        style={styles.backToLogin}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={16}
                            color="#6366F1"
                        />
                        <Text style={styles.linkText}>
                            Back to Sign In
                        </Text>
                    </Pressable>
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
    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 35,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 80,
    },
    iconBox: {
        width: 80,
        height: 80,
        backgroundColor: '#EEF2FF',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 21,
        marginTop: 10,
        marginBottom: 34,
    },
    label: {
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
    },
    button: {
        backgroundColor: '#6366F1',
        height: 54,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    backToLogin: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 28,
    },
    linkText: {
        color: '#6366F1',
        fontSize: 13,
        fontWeight: '700',
    },
});
