
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PasswordField = ({
        label,
        value,
        onChangeText,
        visiblePassword,
        onToggle,
        placeholder,
    }) => (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={!visiblePassword}
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                />

                <Pressable
                    style={styles.eyeButton}
                    onPress={onToggle}
                >
                    <Ionicons
                        name={visiblePassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color="#64748B"
                    />
                </Pressable>
            </View>
        </View>
    );
    
export default function ChangePasswordModal({
    visible,
    onClose,
    onChangePassword,
}) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
    };

    const handleClose = () => {
        if (saving) return;

        resetForm();
        onClose();
    };

    const handleSave = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert(
                'Incomplete Information',
                'Please complete all password fields.'
            );
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert(
                'Invalid Password',
                'Your new password must contain at least 8 characters.'
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert(
                'Password Mismatch',
                'The new passwords do not match.'
            );
            return;
        }

        if (currentPassword === newPassword) {
            Alert.alert(
                'Invalid Password',
                'Your new password must be different from your current password.'
            );
            return;
        }

        if (typeof onChangePassword !== 'function') {
            Alert.alert(
                'Not Configured',
                'The Change Password API is not connected yet.'
            );
            return;
        }

        try {
            setSaving(true);

            await onChangePassword({
                currentPassword,
                newPassword,
            });

            resetForm();
            onClose();

            Alert.alert(
                'Success',
                'Your password has been changed successfully.'
            );

        } catch (error) {
            Alert.alert(
                'Change Password Failed',
                error.message || 'Unable to change password.'
            );
        } finally {
            setSaving(false);
        }
    };


    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={handleClose}
                />

                <View style={styles.modalContainer}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.modalContent}
                    >
                        <View style={styles.header}>
                            <View style={styles.headerIcon}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={26}
                                    color="#6366F1"
                                />
                            </View>

                            <Pressable
                                onPress={handleClose}
                                disabled={saving}
                                style={styles.closeButton}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#64748B"
                                />
                            </Pressable>
                        </View>

                        <Text style={styles.title}>
                            Change Password
                        </Text>

                        <Text style={styles.description}>
                            Enter your current password and choose a new password
                            to keep your account secure.
                        </Text>

                        <PasswordField
                            label="Current Password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            visiblePassword={showCurrent}
                            onToggle={() => setShowCurrent(!showCurrent)}
                            placeholder="Enter current password"
                        />

                        <PasswordField
                            label="New Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            visiblePassword={showNew}
                            onToggle={() => setShowNew(!showNew)}
                            placeholder="Enter new password"
                        />

                        <PasswordField
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            visiblePassword={showConfirm}
                            onToggle={() => setShowConfirm(!showConfirm)}
                            placeholder="Confirm new password"
                        />

                        <View style={styles.hintContainer}>
                            <Ionicons
                                name="information-circle-outline"
                                size={18}
                                color="#6366F1"
                            />

                            <Text style={styles.hintText}>
                                Password must contain at least 8 characters.
                            </Text>
                        </View>

                        {confirmPassword.length > 0 &&
                            newPassword !== confirmPassword && (
                                <Text style={styles.errorText}>
                                    Passwords do not match.
                                </Text>
                            )}

                        <Pressable
                            style={[
                                styles.saveButton,
                                saving && styles.disabledButton,
                            ]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={22}
                                        color="#FFFFFF"
                                    />

                                    <Text style={styles.saveText}>
                                        Update Password
                                    </Text>
                                </>
                            )}
                        </Pressable>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={handleClose}
                            disabled={saving}
                        >
                            <Text style={styles.cancelText}>
                                Cancel
                            </Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        maxHeight: '85%',
        overflow: 'hidden',
        elevation: 12,
    },

    modalContent: {
        padding: 24,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    headerIcon: {
        width: 52,
        height: 52,
        borderRadius: 15,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    closeButton: {
        padding: 8,
    },

    title: {
        fontSize: 23,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
    },

    description: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 21,
        marginBottom: 24,
    },

    fieldContainer: {
        marginBottom: 17,
    },

    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
    },

    inputContainer: {
        height: 52,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    input: {
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 15,
        color: '#0F172A',
    },

    eyeButton: {
        paddingHorizontal: 14,
        paddingVertical: 12,
    },

    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#EEF2FF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 18,
    },

    hintText: {
        flex: 1,
        fontSize: 12,
        color: '#475569',
        lineHeight: 18,
    },

    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginBottom: 12,
    },

    saveButton: {
        height: 54,
        borderRadius: 13,
        backgroundColor: '#4F5DF5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    disabledButton: {
        opacity: 0.6,
    },

    saveText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    cancelButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },

    cancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
});
