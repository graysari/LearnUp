
import {
    View,
    Text,
    StyleSheet,
    Pressable
} from 'react-native';

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useUser } from '../../../context/UserContext';
import { getDailyChallenge } from '../../../services/subjects/subjectApi';
import { DailyTaskSkeleton } from './HomeSkeleton';

export default function DailyChallengeCard() {
    const [dailyTaskLoading, setDailyTaskLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);

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

    // FETCH DAILY TASK
    useFocusEffect(
        useCallback(() => {
            if (!user?.userId) return;

            let active = true;

            const loadDailyChallenge = async () => {
    setDailyTaskLoading(true);

    try {
        const data = await getDailyChallenge(user.userId);

        if (active) {
            setSubjectDailyTask(data);
        }
    } catch (error) {
        console.log('Daily Task Error:', error.message);
    } finally {
        if (active) {
            setDailyTaskLoading(false);
        }
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
                        size={20}
                        color="#6366F1"
                    />
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.dailyTaskTitle}>
                        Daily Task
                    </Text>

                    <Text style={styles.dailyTaskDate}>
                        {new Date().toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </Text>
                </View>

                <Pressable
                    onPress={() => setExpanded(prev => !prev)}
                    style={styles.headerExpandButton}
                    accessibilityRole="button"
                    accessibilityLabel={
                        expanded
                            ? 'Collapse daily task'
                            : 'Expand daily task'
                    }
                    accessibilityState={{ expanded }}
                >
                    <Text style={styles.headerBadgeText}>
                        Daily progress
                    </Text>
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
                    subjects completed
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
                                        item.isFinish
                                            ? 'checkmark-circle-outline'
                                            : 'ellipse-outline'
                                    }
                                    size={15}
                                    color={
                                        item.isFinish
                                            ? '#22C55E'
                                            : '#CBD5E1'
                                    }
                                />

                                <Text
                                    style={styles.taskText}
                                    numberOfLines={2}
                                >
                                    {item.subjectName}
                                </Text>
                            </View>

                            <Text
                                style={[
                                    styles.taskStatus,
                                    item.isFinish && styles.taskStatusDone
                                ]}
                            >
                                {item.isFinish
                                    ? 'Completed'
                                    : 'Not completed'}
                            </Text>

                        </View>
                    ))}

                </View>
            )}

            {/* FOOTER */}
            {expanded && (
                <View style={styles.footer}>

                    <Ionicons
                        name="information-circle-outline"
                        size={15}
                        color="#94A3B8"
                    />

                    <Text style={styles.footerText}>
                        Progress updates automatically after completing a quiz.
                    </Text>

                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    dailyTaskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
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
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerContent: {
        flex: 1,
    },

    dailyTaskTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },

    dailyTaskDate: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 4,
    },

    headerExpandButton: {
        backgroundColor: '#F1F5F9',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerBadgeText: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '500',
    },

    // DESCRIPTION
    dailyTaskDescription: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 14,
        lineHeight: 19,
    },

    // PROGRESS
    progressLabel: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginTop: 14,
    },

    progressCount: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
    },

    progressDescription: {
        fontSize: 11,
        color: '#94A3B8',
    },

    progressTrack: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 12,
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#6366F1',
        borderRadius: 10,
    },

    // SUBJECT LIST
    subjectListContainer: {
        marginTop: 4,
    },

    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 17,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        gap: 8,
    },

    taskSubject: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        flex: 1,
    },

    taskText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#334155',
        flexShrink: 1,
    },

    taskStatus: {
        fontSize: 11,
        color: '#94A3B8',
    },

    taskStatusDone: {
        color: '#16A34A',
        fontWeight: '600',
    },

    // FOOTER
    footer: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginTop: 12,
    },

    footerText: {
        fontSize: 11,
        color: '#64748B',
        lineHeight: 16,
        flex: 1,
    },

});
