import React, { useState } from 'react';

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
    Platform,
    StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
    addTopic,
    editTopic,
} from '../services/topics/topicApi';

const COLORS = {
    primary: '#6366F1',
    background: '#F7FAFC',
    white: '#FFFFFF',
    text: '#0F172A',
    secondary: '#64748B',
    border: '#DCE5F1',
    lightPrimary: '#EEF2FF',
};

export default function AddTopic({ navigation, route }) {

    const {
        subjectId,
        subjectName = 'Subject',
        subjectIcon = 'book-outline',
        gradeId,
        topic,
        topicCount,
        questionCount,
    } = route.params ?? {};

    const isEditing = Boolean(topic);

    const [name, setName] = useState(
        topic?.name ?? topic?.topicName ?? ''
    );

    const [description, setDescription] = useState(
        topic?.description ?? topic?.topicDescription ?? ''
    );

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (saving) return;

        if (!name.trim()) {
            Alert.alert(
                'Required',
                'Please enter a topic name.'
            );
            return;
        }

        if (subjectId == null) {
            Alert.alert(
                'Error',
                'Subject ID is missing.'
            );
            return;
        }

        const payload = {
            name: name.trim(),
            topicName: name.trim(),
            description: description.trim(),
            subjectId: Number(subjectId),
        };

        try {
            setSaving(true);

            if (isEditing) {
                const topicId = topic.topicId ?? topic.id;

                await editTopic(topicId, payload);
            } else {
                await addTopic(payload);
            }

            Alert.alert(
                'Success',
                isEditing
                    ? 'Topic updated successfully.'
                    : 'Topic added successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );

        } catch (error) {
            console.log(
                'Save topic error:',
                error.response?.data ?? error.message
            );

            Alert.alert(
                'Error',
                error.response?.data?.message ||
                'Unable to save topic.'
            );

        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === 'ios'
                    ? 'padding'
                    : undefined
            }
        >
            <StatusBar
                barStyle="dark-content"
                backgroundColor={COLORS.background}
            />

            {/* Header */}
            <View style={styles.header}>

                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={COLORS.text}
                    />
                </Pressable>

                <Text style={styles.headerTitle}>
                    {isEditing ? 'Edit Topic' : 'Add Topic'}
                </Text>

                <View style={styles.headerRight} />

            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                {/* Subject summary */}
                <View style={styles.subjectCard}>

                    <View style={styles.subjectIconContainer}>
                        <Ionicons
                            name={subjectIcon}
                            size={35}
                            color={COLORS.primary}
                        />
                    </View>

                    <View style={styles.subjectDetails}>

                        <Text
                            style={styles.subjectName}
                            numberOfLines={1}
                        >
                            {subjectName}
                        </Text>

                        {gradeId != null && (
                            <Text style={styles.subjectGrade}>
                                Grade {gradeId}
                            </Text>
                        )}

                        {(topicCount != null ||
                            questionCount != null) && (
                            <Text style={styles.subjectStats}>
                                {topicCount != null
                                    ? `${topicCount} topics`
                                    : ''}
                                {topicCount != null &&
                                    questionCount != null
                                    ? ' • '
                                    : ''}
                                {questionCount != null
                                    ? `${questionCount} questions`
                                    : ''}
                            </Text>
                        )}

                    </View>
                </View>

                {/* Topic Name */}
                <View style={styles.fieldGroup}>

                    <Text style={styles.label}>
                        Topic Name{' '}
                        <Text style={styles.required}>*</Text>
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Addition"
                        placeholderTextColor="#94A3B8"
                        value={name}
                        onChangeText={setName}
                        maxLength={100}
                        autoCorrect={false}
                    />

                    <Text style={styles.characterCount}>
                        {name.length}/100
                    </Text>

                </View>

                {/* Description */}
                <View style={styles.fieldGroup}>

                    <Text style={styles.label}>
                        Description
                    </Text>

                    <View style={styles.descriptionContainer}>

                        <TextInput
                            style={styles.descriptionInput}
                            placeholder="Enter a short description of this topic..."
                            placeholderTextColor="#94A3B8"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                            maxLength={500}
                        />

                        <Text style={styles.descriptionCount}>
                            {description.length}/500
                        </Text>

                    </View>

                    <Text style={styles.helperText}>
                        Briefly describe what students will learn.
                    </Text>

                </View>

                {/* Information */}
                <View style={styles.infoCard}>

                    <View style={styles.infoIconContainer}>
                        <Ionicons
                            name="information"
                            size={22}
                            color="#FFFFFF"
                        />
                    </View>

                    <Text style={styles.infoText}>
                        After saving this topic, you can add
                        questions from the Manage Questions screen.
                    </Text>

                </View>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>

                <Pressable
                    style={[
                        styles.saveButton,
                        saving && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={saving}
                >

                    {saving ? (
                        <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                        />
                    ) : (
                        <>
                            <Ionicons
                                name={
                                    isEditing
                                        ? 'checkmark-circle-outline'
                                        : 'add-circle-outline'
                                }
                                size={24}
                                color="#FFFFFF"
                            />

                            <Text style={styles.saveButtonText}>
                                {isEditing
                                    ? 'Update Topic'
                                    : 'Save Topic'}
                            </Text>
                        </>
                    )}

                </Pressable>

            </View>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 45,
        paddingBottom: 18,
    },

    backButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
    },

    headerRight: {
        width: 36,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 35,
    },

    subjectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightPrimary,
        borderRadius: 18,
        padding: 14,
        marginBottom: 30,
        gap: 14,
    },

    subjectIconContainer: {
        width: 76,
        height: 76,
        borderRadius: 19,
        backgroundColor: '#DFE5FF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    subjectDetails: {
        flex: 1,
    },

    subjectName: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.text,
    },

    subjectGrade: {
        fontSize: 13,
        color: COLORS.secondary,
        marginTop: 6,
    },

    subjectStats: {
        fontSize: 12,
        color: '#7185A6',
        marginTop: 7,
    },

    fieldGroup: {
        marginBottom: 26,
    },

    label: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 11,
    },

    required: {
        color: '#EF4444',
    },

    input: {
        height: 55,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 13,
        paddingHorizontal: 15,
        fontSize: 15,
        color: COLORS.text,
    },

    characterCount: {
        fontSize: 12,
        color: '#7185A6',
        textAlign: 'right',
        marginTop: 8,
    },

    descriptionContainer: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 13,
        overflow: 'hidden',
    },

    descriptionInput: {
        minHeight: 140,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 30,
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.text,
    },

    descriptionCount: {
        position: 'absolute',
        right: 12,
        bottom: 10,
        fontSize: 12,
        color: '#7185A6',
    },

    helperText: {
        fontSize: 12,
        color: '#7185A6',
        marginTop: 10,
    },

    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightPrimary,
        borderRadius: 14,
        padding: 17,
        gap: 13,
    },

    infoIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
        color: '#475569',
    },

    footer: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 18,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },

    saveButton: {
        height: 55,
        backgroundColor: COLORS.primary,
        borderRadius: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    saveButtonDisabled: {
        opacity: 0.65,
    },

    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },

});