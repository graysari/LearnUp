
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Alert,
    ActivityIndicator,
    StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function CreateAccount({ navigation }) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [grade, setGrade] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [loading, setLoading] = useState(false);

    const formatBirthday = (value) => {
        if (!value) return 'Select your birthday';

        const [year, month, day] = value.split('-').map(Number);

        return new Date(year, month - 1, day).toLocaleDateString(
            'en-US',
            {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }
        );
    };

    const handleBirthdayChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (event.type === 'dismissed' || !selectedDate) {
            return;
        }

        const year = selectedDate.getFullYear();
        const month = String(
            selectedDate.getMonth() + 1
        ).padStart(2, '0');
        const day = String(
            selectedDate.getDate()
        ).padStart(2, '0');

        setBirthday(`${year}-${month}-${day}`);
    };

    const handleRegister = async () => {

        if (loading) return;

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !username.trim() ||
            !birthday ||
            !grade ||
            !password ||
            !confirmPassword
        ) {
            Alert.alert(
                'Missing information',
                'Please complete all required fields.'
            );
            return;
        }

        if (password.length < 8) {
            Alert.alert(
                'Invalid password',
                'Password must contain at least 8 characters.'
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(
                'Password mismatch',
                'Passwords do not match.'
            );
            return;
        }

        const payload = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            userName: username.trim(),
            birthday,
            gender: gender || null,
            grade: Number(grade),
            password,
        };

        // Registration API will be connected here.
        // Example:
        // await registerUser(payload);

        Alert.alert(
            'Registration not connected',
            'The form is valid, but the registration API still needs to be implemented.'
        );
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
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            >

                {/* BACK BUTTON */}
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={23}
                        color="#334155"
                    />
                </Pressable>

                {/* HEADER */}
                <View style={styles.header}>

                    <View style={styles.iconBox}>
                        <Ionicons
                            name="person-add-outline"
                            size={31}
                            color="#6366F1"
                        />
                    </View>

                    <Text style={styles.title}>
                        Create Account
                    </Text>

                    <Text style={styles.subtitle}>
                        Start your learning journey with LearnUp.
                    </Text>

                </View>

                {/* PERSONAL INFORMATION */}
                <View style={styles.sectionHeader}>
                    <Ionicons
                        name="person-outline"
                        size={20}
                        color="#6366F1"
                    />
                    <Text style={styles.sectionTitle}>
                        Personal Information
                    </Text>
                </View>

                {/* FIRST NAME */}
                <Text style={styles.label}>
                    First Name <Text style={styles.required}>*</Text>
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter first name"
                    placeholderTextColor="#94A3B8"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    editable={!loading}
                />

                {/* LAST NAME */}
                <Text style={styles.label}>
                    Last Name <Text style={styles.required}>*</Text>
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter last name"
                    placeholderTextColor="#94A3B8"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    editable={!loading}
                />

                {/* BIRTHDAY */}
                <Text style={styles.label}>
                    Birthday <Text style={styles.required}>*</Text>
                </Text>

                <Pressable
                    style={styles.birthdayInput}
                    onPress={() => setShowDatePicker(true)}
                    disabled={loading}
                >
                    <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#6366F1"
                    />

                    <Text
                        style={[
                            styles.birthdayText,
                            !birthday && styles.placeholderText,
                        ]}
                    >
                        {formatBirthday(birthday)}
                    </Text>

                    <Ionicons
                        name="chevron-down"
                        size={18}
                        color="#94A3B8"
                    />
                </Pressable>

                {showDatePicker && (
                    <View>
                        <DateTimePicker
                            value={
                                birthday
                                    ? (() => {
                                        const [year, month, day] =
                                            birthday.split('-').map(Number);
                                        return new Date(year, month - 1, day);
                                    })()
                                    : new Date(2015, 0, 1)
                            }
                            mode="date"
                            display="default"
                            maximumDate={new Date()}
                            onChange={handleBirthdayChange}
                        />

                        {Platform.OS === 'ios' && (
                            <Pressable
                                style={styles.dateDoneButton}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.dateDoneText}>
                                    Done
                                </Text>
                            </Pressable>
                        )}
                    </View>
                )}

                {/* GENDER */}
                <Text style={styles.label}>
                    Gender
                </Text>

                <View style={styles.genderContainer}>
                    {['Male', 'Female', 'Prefer not to say'].map(item => (
                        <Pressable
                            key={item}
                            style={[
                                styles.genderButton,
                                gender === item && styles.genderSelected,
                            ]}
                            onPress={() => setGender(item)}
                            disabled={loading}
                        >
                            <Ionicons
                                name={
                                    gender === item
                                        ? 'radio-button-on'
                                        : 'radio-button-off'
                                }
                                size={17}
                                color={
                                    gender === item
                                        ? '#6366F1'
                                        : '#94A3B8'
                                }
                            />

                            <Text
                                style={[
                                    styles.genderText,
                                    gender === item && styles.genderTextSelected,
                                ]}
                            >
                                {item}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* LEARNING LEVEL DROPDOWN */}
                <Text style={styles.label}>
                    Learning Level <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={grade}
                        onValueChange={(value) => setGrade(value)}
                        mode="dropdown"
                        dropdownIconColor="#6366F1"
                        style={styles.picker}
                        enabled={!loading}
                    >
                        <Picker.Item
                            label="Select learning level"
                            value={null}
                            color="#94A3B8"
                        />

                        {Array.from(
                            { length: 12 },
                            (_, index) => index + 1
                        ).map(item => (
                            <Picker.Item
                                key={item}
                                label={`Grade ${item}`}
                                value={item}
                            />
                        ))}

                        <Picker.Item
                            label="Life Skills & General Knowledge"
                            value={13}
                        />
                    </Picker>
                </View>

                {/* ACCOUNT INFORMATION */}
                <View style={[styles.sectionHeader, styles.accountSection]}>
                    <Ionicons
                        name="shield-checkmark-outline"
                        size={20}
                        color="#6366F1"
                    />
                    <Text style={styles.sectionTitle}>
                        Account Information
                    </Text>
                </View>

                {/* USERNAME */}
                <Text style={styles.label}>
                    Username <Text style={styles.required}>*</Text>
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Choose a username"
                    placeholderTextColor="#94A3B8"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                />

                {/* PASSWORD */}
                <Text style={styles.label}>
                    Password <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.passwordContainer}>
                    <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#94A3B8"
                    />

                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Create password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        editable={!loading}
                    />

                    <Pressable
                        onPress={() => setShowPassword(prev => !prev)}
                        disabled={loading}
                    >
                        <Ionicons
                            name={
                                showPassword
                                    ? 'eye-outline'
                                    : 'eye-off-outline'
                            }
                            size={20}
                            color="#94A3B8"
                        />
                    </Pressable>
                </View>

                <Text style={styles.passwordHint}>
                    Use at least 8 characters.
                </Text>

                {/* CONFIRM PASSWORD */}
                <Text style={styles.label}>
                    Confirm Password <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.passwordContainer}>
                    <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#94A3B8"
                    />

                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry={!showPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        autoCapitalize="none"
                        editable={!loading}
                    />
                </View>

                {/* REGISTER BUTTON */}
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        (pressed || loading) && styles.buttonPressed,
                    ]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons
                                name="person-add-outline"
                                size={20}
                                color="#FFFFFF"
                            />

                            <Text style={styles.buttonText}>
                                Create Account
                            </Text>
                        </>
                    )}
                </Pressable>

                {/* SIGN IN LINK */}
                <Pressable
                    style={styles.loginLink}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.bottomText}>
                        Already have an account?{' '}
                        <Text style={styles.linkText}>
                            Sign In
                        </Text>
                    </Text>
                </Pressable>

                {/* FOOTER */}
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

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 45,
    },

    backButton: {
        width: 42,
        height: 42,
        justifyContent: 'center',
        marginBottom: 16,
    },

    header: {
        alignItems: 'center',
        marginBottom: 28,
    },

    iconBox: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    title: {
        fontSize: 27,
        fontWeight: '800',
        color: '#1E293B',
    },

    subtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 8,
        textAlign: 'center',
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        paddingBottom: 12,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
    },

    accountSection: {
        marginTop: 30,
    },

    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginTop: 16,
        marginBottom: 8,
    },

    required: {
        color: '#EF4444',
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        fontSize: 14,
        color: '#1E293B',
    },

    birthdayInput: {
        height: 52,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    birthdayText: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
    },

    placeholderText: {
        color: '#94A3B8',
    },

    dateDoneButton: {
        alignSelf: 'flex-end',
        padding: 12,
    },

    dateDoneText: {
        color: '#6366F1',
        fontWeight: '700',
    },

    genderContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    genderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 11,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },

    genderSelected: {
        borderColor: '#6366F1',
        backgroundColor: '#EEF2FF',
    },

    genderText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
    },

    genderTextSelected: {
        color: '#6366F1',
        fontWeight: '600',
    },

    pickerContainer: {
        height: 54,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    picker: {
        width: '100%',
        height: 54,
        color: '#1E293B',
        backgroundColor: 'transparent',
    },

    passwordContainer: {
        height: 52,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    passwordInput: {
        flex: 1,
        height: '100%',
        fontSize: 14,
        color: '#1E293B',
        paddingVertical: 0,
    },

    passwordHint: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 7,
    },

    button: {
        height: 54,
        borderRadius: 12,
        backgroundColor: '#6366F1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 32,
    },

    buttonPressed: {
        opacity: 0.7,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

    loginLink: {
        alignItems: 'center',
        marginTop: 24,
    },

    bottomText: {
        fontSize: 13,
        color: '#64748B',
    },

    linkText: {
        color: '#6366F1',
        fontWeight: '700',
    },

    footerText: {
        color: '#94A3B8',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 36,
    },

});
