
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useUser } from '../../../context/UserContext';
import { getDailyChallenge } from '../../../services/subjects/subjectApi';

export default function DailyChallengeCard() {

    const [expanded, setExpanded] = useState(false);

    const {
        user,
        subjectDailyTask,
        setSubjectDailyTask
    } = useUser();

    const completedTasks = subjectDailyTask.filter(
        item => item.isFinish
    ).length;

    const totalTasks = subjectDailyTask.length;

    const progress = totalTasks > 0
        ? (completedTasks / totalTasks) * 100
        : 0;

    // FETCH DAILY CHALLENGE
    useFocusEffect(
        useCallback(() => {
            if (!user?.userId) return;

            let active = true;

            const loadDailyChallenge = async () => {
                try {
                    const data = await getDailyChallenge(user.userId);

                    if (active) {
                        setSubjectDailyTask(data);
                    }

                } catch (error) {
                    console.log(
                        'Daily Challenge Error:',
                        error.message
                    );
                }
            };

            loadDailyChallenge();

            return () => {
                active = false;
            };

        }, [user?.userId, setSubjectDailyTask])
    );

    return (
        <View style={styles.dailyTaskCard}>

            {/* HEADER */}
            <View style={styles.dailyTaskHeader}>

                <View style={styles.dailyTaskIcon}>
                    <Ionicons
                        name="calendar-outline"
                        size={22}
                        color="#6366F1"
                    />
                </View>

                <View style={styles.headerContent}>

                    <Text style={styles.dailyTaskTitle}>
                        Daily Challenge
                    </Text>

                    <Text style={styles.dailyTaskDate}>
                        {new Date().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </Text>

                </View>

                {/* EXPAND / COLLAPSE ARROW */}
                <Pressable
                    onPress={() => setExpanded(prev => !prev)}
                    style={({ pressed }) => [
                        styles.headerExpandButton,
                        pressed && styles.buttonPressed
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={
                        expanded
                            ? 'Collapse daily challenge'
                            : 'Expand daily challenge'
                    }
                    accessibilityState={{ expanded }}
                >
                    <Ionicons
                        name={
                            expanded
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        size={24}
                        color="#6366F1"
                    />
                </Pressable>

            </View>

            {/* DESCRIPTION */}
            <Text style={styles.dailyTaskDescription}>
                Pass at least 1 topic in every subject today.
            </Text>

            {/* PROGRESS */}
            <View style={styles.progressLabel}>

                <Text style={styles.progressCount}>
                    {completedTasks} / {totalTasks}
                </Text>

                <Text style={styles.progressDescription}>
                    Subjects completed
                </Text>

            </View>

            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${progress}%` }
                    ]}
                />
            </View>

            {/* COLLAPSIBLE SUBJECT LIST */}
            {expanded && (
                <View style={styles.subjectListContainer}>

                    {subjectDailyTask.map((item) => (
                        <View
                            key={item.subjectId}
                            style={styles.taskItem}
                        >

                            <View style={styles.taskSubject}>

                                <Ionicons
                                    name={
                                        item.subjectIcon ||
                                        'book-outline'
                                    }
                                    size={20}
                                    color="#6366F1"
                                />

                                <Text style={styles.taskText}>
                                    {item.subjectName}
                                </Text>

                            </View>

                            <Ionicons
                                name={
                                    item.isFinish
                                        ? 'checkmark-circle'
                                        : 'ellipse-outline'
                                }
                                size={24}
                                color={
                                    item.isFinish
                                        ? '#16A34A'
                                        : '#CBD5E1'
                                }
                            />

                        </View>
                    ))}

                </View>
            )}

            {/* SHOW MORE / SHOW LESS */}
            {totalTasks > 0 && (
                <Pressable
                    onPress={() => setExpanded(prev => !prev)}
                    style={({ pressed }) => [
                        styles.expandButton,
                        pressed && styles.buttonPressed
                    ]}
                >
                    <Text style={styles.expandButtonText}>
                        {expanded
                            ? 'Show Less'
                            : 'Show All Subjects'}
                    </Text>

                    <Ionicons
                        name={
                            expanded
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        size={18}
                        color="#6366F1"
                    />

                </Pressable>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    dailyTaskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
    },

    // HEADER
    dailyTaskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    dailyTaskIcon: {
        backgroundColor: '#EEF2FF',
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerContent: {
        flex: 1,
    },

    dailyTaskTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },

    dailyTaskDate: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 3,
    },

    headerExpandButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
    },

    // DESCRIPTION
    dailyTaskDescription: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 12,
        lineHeight: 20,
    },

    // PROGRESS
    progressLabel: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10,
        marginTop: 20,
    },

    progressCount: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1E293B',
    },

    progressDescription: {
        fontSize: 13,
        color: '#64748B',
        flexShrink: 1,
    },

    progressTrack: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 10,
        marginBottom: 12,
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#6366F1',
        borderRadius: 8,
    },

    // SUBJECT LIST
    subjectListContainer: {
        marginTop: 6,
        marginBottom: 4,
    },

    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 6,
    },

    taskSubject: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        marginRight: 8,
    },

    taskText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1E293B',
        flexShrink: 1,
    },

    // SHOW MORE BUTTON
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        marginTop: 4,
    },

    expandButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },

    buttonPressed: {
        opacity: 0.6,
    },

});
