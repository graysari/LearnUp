
import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

const COLORS = {
    primary: '#6366F1',
    background: '#F7FAFC',
    white: '#FFFFFF',
    text: '#0F172A',
    secondary: '#64748B',
    border: '#E2E8F0',
};

const SUBJECT_ICONS = {
    'calculator-outline': ['#EEF2FF', '#6366F1'],
    'flask-outline': ['#FEE2E2', '#EF4444'],
    'book-outline': ['#FCE7F3', '#E11D48'],
    'document-text-outline': ['#FFEDD5', '#F97316'],
    'globe-outline': ['#E0F2FE', '#0284C7'],
    'musical-notes-outline': ['#EDE9FE', '#8B5CF6'],
};

export default function ManageSubjects({ navigation }) {
    const [subjects, setSubjects] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [loading, setLoading] = useState(true);

    const loadSubjects = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/Subjects');
            setSubjects(response.data);
        } catch (error) {
            console.log('Load subjects error:', error);
            Alert.alert('Error', 'Unable to load subjects.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadSubjects();
        }, [loadSubjects])
    );

    const grades = useMemo(() => {
        const values = subjects
            .map(item => Number(item.gradeId ?? item.grade))
            .filter(Number.isFinite);

        return ['All', ...new Set(values)].sort((a, b) => {
            if (a === 'All') return -1;
            if (b === 'All') return 1;
            return a - b;
        });
    }, [subjects]);

    const filteredSubjects = subjects.filter(subject => {
        const matchesSearch = subject.name
            ?.toLowerCase()
            .includes(search.toLowerCase());

        const matchesGrade =
            selectedGrade === 'All' ||
            Number(subject.gradeId ?? subject.grade) === selectedGrade;

        return matchesSearch && matchesGrade;
    });

    const handleDelete = (subject) => {
        Alert.alert(
            'Delete Subject',
            `Are you sure you want to delete "${subject.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/Subjects/${subject.id}`);
                            await loadSubjects();
                        } catch (error) {
                            Alert.alert(
                                'Error',
                                'Unable to delete this subject. It may have related topics.'
                            );
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={COLORS.text}
                    />
                </Pressable>

                <Text style={styles.headerTitle}>
                    Manage Subjects
                </Text>

                <Pressable
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddSubject')}
                >
                    <Ionicons name="add" size={26} color="#FFF" />
                </Pressable>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons
                    name="search-outline"
                    size={20}
                    color="#94A3B8"
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search subjects..."
                    placeholderTextColor="#94A3B8"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContent}
                >
                    {grades.map(grade => (
                        <Pressable
                            key={String(grade)}
                            style={[
                                styles.filterChip,
                                selectedGrade === grade &&
                                    styles.filterChipActive,
                            ]}
                            onPress={() => setSelectedGrade(grade)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedGrade === grade &&
                                        styles.filterTextActive,
                                ]}
                            >
                                {grade === 'All' ? 'All' : `Grade ${grade}`}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                    style={{ marginTop: 40 }}
                />
            ) : (
                <ScrollView
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredSubjects.length === 0 && (
                        <Text style={styles.emptyText}>
                            No subjects found.
                        </Text>
                    )}

                    {filteredSubjects.map(subject => {
                        const iconName =
                            subject.icon || 'book-outline';

                        const [backgroundColor, iconColor] =
                            SUBJECT_ICONS[iconName] ||
                            ['#EEF2FF', '#6366F1'];

                        return (
                            <Pressable
                                key={subject.id}
                                style={styles.subjectCard}
                                onPress={() =>
                                    navigation.navigate('ManageTopics', {
                                        subjectId: subject.id,
                                        subjectName: subject.name,
                                    })
                                }
                            >
                                <View
                                    style={[
                                        styles.iconContainer,
                                        { backgroundColor },
                                    ]}
                                >
                                    <Ionicons
                                        name={iconName}
                                        size={25}
                                        color={iconColor}
                                    />
                                </View>

                                <View style={styles.subjectDetails}>
                                    <Text style={styles.subjectName}>
                                        {subject.name}
                                    </Text>
                                    <Text style={styles.subjectGrade}>
                                        Grade {subject.gradeId ?? subject.grade}
                                    </Text>

                                    <Text style={styles.subjectCount}>
                                        {subject.topicCount ?? 0} topics
                                        {subject.questionCount != null
                                            ? ` • ${subject.questionCount} questions`
                                            : ''}
                                    </Text>
                                </View>

                                <Pressable
                                    style={styles.actionButton}
                                    onPress={() =>
                                        navigation.navigate('AddSubject', {
                                            subject,
                                        })
                                    }
                                >
                                    <Ionicons
                                        name="pencil"
                                        size={19}
                                        color="#2563A6"
                                    />
                                </Pressable>

                                <Pressable
                                    style={styles.actionButton}
                                    onPress={() => handleDelete(subject)}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={19}
                                        color="#EF4444"
                                    />
                                </Pressable>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            )}
        </View>
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 18,
        
        marginTop:30
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
    },
    addButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        height: 48,
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 14,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 25,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
    },
    filterContainer: {
        marginBottom: 14,
    },
    filterContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 20,
    },
    filterChipActive: {
        backgroundColor: '#818CF8',
    },
    filterText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        gap: 10,
    },
    subjectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 13,
        gap: 12,
        minHeight: 86,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subjectDetails: {
        flex: 1,
        minWidth: 0,
    },
    subjectName: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
    },
    subjectGrade: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 3,
    },
    subjectCount: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 2,
    },
    actionButton: {
        padding: 6,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.secondary,
        marginTop: 40,
    },
});
