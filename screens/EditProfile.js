
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Image,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '../context/UserContext';
import { Picker } from '@react-native-picker/picker';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { updateProfile, changePassword, uploadProfilePicture } from '../services/userApi'
import * as ImagePicker from 'expo-image-picker'
import { getProfilePictureUrl } from '../utils/imageHelper'

export default function EditProfile({ navigation }) {

    const [profilePicture, setProfilePicture] = useState(
        user?.profilePicture ?? null
    );
    useEffect(() => {
        setProfilePicture(user?.profilePicture ?? null);
    }, [user?.profilePicture]);
    const { user, setUser, token } = useUser();
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [firstName, setFirstName] = useState(user?.firstName ?? '');
    const [middleName, setMiddleName] = useState(user?.middleName ?? '');
    const [lastName, setLastName] = useState(user?.lastName ?? '');
    const [userName, setUserName] = useState(user?.userName ?? '');
    const [gender, setGender] = useState(user?.gender ?? '');
    const [grade, setGrade] = useState(user?.grade ?? 4);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleSelectPicture = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                'Permission Required',
                'Please allow access to your photos.'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const uri = result.assets[0].uri;

            setSelectedPicture(uri);
            setProfilePicture(uri);
        }
    };


    const handleChangePassword = async ({ currentPassword, newPassword }) => {
        await changePassword(currentPassword, newPassword, token);
    };

    const parseBirthday = (value) => {
        if (!value) return null;

        const parts = String(value)
            .substring(0, 10)
            .split('-')
            .map(Number);

        if (parts.length !== 3 || parts.some(Number.isNaN)) {
            return null;
        }

        const date = new Date(parts[0], parts[1] - 1, parts[2]);

        if (
            date.getFullYear() !== parts[0] ||
            date.getMonth() !== parts[1] - 1 ||
            date.getDate() !== parts[2]
        ) {
            return null;
        }

        return date;
    };

    const [birthday, setBirthday] = useState(
        () => parseBirthday(user?.birthday)
    );

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [saving, setSaving] = useState(false);

    const formatBirthday = (date) => {
        if (!date) return 'Select your birthday';

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const birthdayToApi = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleBirthdayChange = (event, selectedDate) => {
        if (selectedDate) {
            setBirthday(selectedDate);
        }

        setShowDatePicker(false);
    };

    const handleBirthdayDismiss = () => {
        setShowDatePicker(false);
    };

    const handleSave = async () => {
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !userName.trim() ||
            !birthday ||
            !gender ||
            !grade
        ) {
            Alert.alert(
                'Incomplete Information',
                'Please complete all required fields.'
            );
            return;
        }

        if (birthday > new Date()) {
            Alert.alert('Invalid Birthday', 'Birthday cannot be in the future.');
            return;
        }

        if (!user?.userId) {
            Alert.alert('Error', 'User information is missing.');
            return;
        }

        const updatedProfile = {
            firstName: firstName.trim(),
            middleName: middleName.trim() || null,
            lastName: lastName.trim(),
            birthday: birthdayToApi(birthday),
            gender,
            grade,
            userName: userName.trim(),
        };

        try {
            setSaving(true);

            const result = await updateProfile(
                user.userId,
                updatedProfile,
                token
            );

            let updatedUser = {
                ...user,
                ...result.user,
            };

            if (selectedPicture) {
                const pictureResult = await uploadProfilePicture(
                    selectedPicture,
                    token
                );
                updatedUser.profilePicture = pictureResult.profilePicture;

                setProfilePicture(pictureResult.profilePicture);
                setSelectedPicture(null);
            }

            setUser(updatedUser);

            // Update the current user throughout LearnUp
            setUser(previousUser => ({
                ...previousUser,
                ...updatedUser,
            }));

            Alert.alert(
                'Success',
                'Profile updated successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );

        } catch (error) {
            Alert.alert(
                'Update Failed',
                error.message || 'Unable to update your profile.'
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#0F172A"
                        />
                    </Pressable>

                    <Text style={styles.headerTitle}>
                        Edit Profile
                    </Text>
                </View>

                {/* Avatar */}
                <View style={styles.profileSection}>
                    <Pressable
                        style={styles.avatar}
                        onPress={handleSelectPicture}
                    >
                        {profilePicture ? (
                            <Image
                                source={{ uri: getProfilePictureUrl(profilePicture) }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <Ionicons
                                name="person"
                                size={48}
                                color="#6366F1"
                            />
                        )}

                        <View style={styles.cameraButton}>
                            <Ionicons
                                name="camera"
                                size={17}
                                color="#FFFFFF"
                            />
                        </View>
                    </Pressable>

                    <Text style={styles.profileName}>
                        {user?.lastName}, {user?.firstName}
                    </Text>

                    <Text style={styles.profileGrade}>
                        Grade {user?.grade} Student
                    </Text>
                </View>

                {/* Personal Information */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            <Ionicons
                                name="person-outline"
                                size={23}
                                color="#6366F1"
                            />
                        </View>

                        <Text style={styles.sectionTitle}>
                            Personal Information
                        </Text>
                    </View>

                    <Text style={styles.label}>
                        First Name <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First name"
                        placeholderTextColor="#94A3B8"
                    />

                    <Text style={styles.label}>Middle Name</Text>
                    <TextInput
                        style={styles.input}
                        value={middleName}
                        onChangeText={setMiddleName}
                        placeholder="Optional"
                        placeholderTextColor="#94A3B8"
                    />

                    <Text style={styles.label}>
                        Last Name <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last name"
                        placeholderTextColor="#94A3B8"
                    />

                    {/* Birthday */}
                    <Text style={styles.label}>
                        Birthday <Text style={styles.required}>*</Text>
                    </Text>

                    <Pressable
                        style={styles.dateInput}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={22}
                            color="#6366F1"
                        />

                        <Text
                            style={[
                                styles.dateText,
                                !birthday && { color: '#94A3B8' },
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
                        <DateTimePicker
                            value={birthday || new Date(2015, 0, 1)}
                            mode="date"
                            display="default"
                            maximumDate={new Date()}
                            onValueChange={handleBirthdayChange}
                            onDismiss={handleBirthdayDismiss}
                        />
                    )}

                    {/* Gender */}
                    <Text style={styles.label}>
                        Gender <Text style={styles.required}>*</Text>
                    </Text>

                    <View style={styles.genderContainer}>
                        {['Male', 'Female'].map(item => (
                            <Pressable
                                key={item}
                                style={[
                                    styles.genderButton,
                                    gender === item && styles.genderSelected,
                                ]}
                                onPress={() => setGender(item)}
                            >
                                <Ionicons
                                    name={
                                        gender === item
                                            ? 'radio-button-on'
                                            : 'radio-button-off'
                                    }
                                    size={21}
                                    color={
                                        gender === item
                                            ? '#6366F1'
                                            : '#94A3B8'
                                    }
                                />

                                <Text
                                    style={[
                                        styles.genderText,
                                        gender === item && {
                                            color: '#6366F1',
                                        },
                                    ]}
                                >
                                    {item}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Grade */}
                    <Text style={styles.label}>Learning Level</Text>

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={grade}
                            onValueChange={(value) => setGrade(value)}
                            mode="dropdown"
                            dropdownIconColor="#6366F1"
                            style={styles.picker}
                        >
                            {Array.from({ length: 12 }, (_, index) => index + 1).map(item => (
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
                </View>

                {/* Account Information */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={23}
                                color="#6366F1"
                            />
                        </View>

                        <Text style={styles.sectionTitle}>
                            Account Information
                        </Text>
                    </View>

                    <Text style={styles.label}>
                        Username <Text style={styles.required}>*</Text>
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={userName}
                        onChangeText={setUserName}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Username"
                        placeholderTextColor="#94A3B8"
                    />

                    <Pressable
                        style={styles.passwordRow}
                        onPress={() => setShowPasswordModal(true)}
                    >
                        <View style={styles.passwordIcon}>
                            <Ionicons
                                name="key-outline"
                                size={23}
                                color="#6366F1"
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.passwordTitle}>
                                Change Password
                            </Text>
                            <Text style={styles.passwordDescription}>
                                Update your account password
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#94A3B8"
                        />
                    </Pressable>
                </View>
                <ChangePasswordModal
                    visible={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    onChangePassword={handleChangePassword}
                />
                {/* Save Button */}
                <Pressable
                    style={[
                        styles.saveButton,
                        saving && { opacity: 0.6 },
                    ]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons
                                name="save-outline"
                                size={22}
                                color="#FFFFFF"
                            />
                            <Text style={styles.saveText}>
                                Save Changes
                            </Text>
                        </>
                    )}
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    profileImage: {
        width: 85,
        height: 85,
        borderRadius: 43,
    },

    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    pickerContainer: {
        height: 54,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    picker: {
        width: '100%',
        height: 54,
        color: '#0F172A',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    content: {
        padding: 20,
        paddingBottom: 50,
        gap: 20,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop:20,
    },

    backButton: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        fontSize: 23,
        fontWeight: '700',
        color: '#0F172A',
    },

    profileSection: {
        alignItems: 'center',
        paddingVertical: 12,
        gap: 5,
    },

    avatar: {
        width: 85,
        height: 85,
        borderRadius: 43,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    profileName: {
        fontSize: 21,
        fontWeight: '700',
        color: '#0F172A',
    },

    profileGrade: {
        fontSize: 15,
        color: '#64748B',
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 20,
        gap: 10,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },

    sectionIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        flexShrink: 1,
    },

    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        marginTop: 6,
    },

    required: {
        color: '#EF4444',
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#0F172A',
        backgroundColor: '#FFFFFF',
    },

    dateInput: {
        height: 52,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        gap: 12,
    },

    dateText: {
        flex: 1,
        fontSize: 16,
        color: '#0F172A',
    },

    genderContainer: {
        flexDirection: 'row',
        gap: 12,
    },

    genderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 50,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
    },

    genderSelected: {
        borderColor: '#6366F1',
        backgroundColor: '#EEF2FF',
    },

    genderText: {
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '500',
    },

    readOnlyInput: {
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        gap: 12,
    },

    readOnlyText: {
        flex: 1,
        fontSize: 16,
        color: '#64748B',
    },

    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        marginTop: 8,
    },

    passwordIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    passwordTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },

    passwordDescription: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },

    saveButton: {
        height: 56,
        borderRadius: 14,
        backgroundColor: '#4F5DF5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    saveText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
