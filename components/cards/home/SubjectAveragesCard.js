
import {
    View,
    Text,
    StyleSheet,
    Pressable
} from 'react-native';

import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SubjectAveragesCard({ subjects = [] }) {

    const [expanded, setExpanded] = useState(true);

    const getProgressColor = (average) => {
        if (average === null || average === undefined) {
            return '#CBD5E1';
        }

        if (average >= 85) return '#22C55E';
        if (average >= 75) return '#3B82F6';

        return '#F59E0B';
    };

    return (
        <View style={styles.card}>

            {/* HEADER */}
            <View style={styles.header}>

                <View style={styles.iconBox}>
                    <Ionicons
                        name="stats-chart-outline"
                        size={22}
                        color="#6366F1"
                    />
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.title}>
                        Subject Averages
                    </Text>

                    <Text style={styles.subtitle}>
                        Average of attempted topics
                    </Text>
                </View>

                <Pressable
                    onPress={() => setExpanded(prev => !prev)}
                    style={styles.expandButton}
                    accessibilityRole="button"
                    accessibilityLabel={
                        expanded
                            ? 'Collapse subject averages'
                            : 'Expand subject averages'
                    }
                >
                    <Ionicons
                        name={
                            expanded
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        size={22}
                        color="#6366F1"
                    />
                </Pressable>

            </View>

            {/* SUBJECT LIST */}
            {expanded && (
                <View style={styles.subjectList}>

                    {subjects.map((subject) => {

                        const average = subject.averageGrade;

                        const hasGrade =
                            average !== null &&
                            average !== undefined;

                        const color = getProgressColor(average);

                        return (
                            <View
                                key={subject.id}
                                style={styles.subjectItem}
                            >

                                <View style={styles.subjectHeader}>

                                    <Ionicons
                                        name={
                                            subject.icon ||
                                            'book-outline'
                                        }
                                        size={21}
                                        color="#6366F1"
                                    />

                                    <View style={styles.subjectInfo}>

                                        <Text style={styles.subjectName}>
                                            {subject.name}
                                        </Text>

                                        <Text style={styles.topicCount}>
                                            {subject.takenTopicCount} of{' '}
                                            {subject.topicCount} topics attempted
                                        </Text>

                                    </View>

                                    <Text
                                        style={[
                                            styles.averageText,
                                            { color }
                                        ]}
                                    >
                                        {hasGrade
                                            ? `${average.toFixed(1)}%`
                                            : 'No grade yet'}
                                    </Text>

                                </View>

                                <View style={styles.progressTrack}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${
                                                    hasGrade
                                                        ? Math.max(
                                                            0,
                                                            Math.min(100, average)
                                                        )
                                                        : 0
                                                }%`,
                                                backgroundColor: color
                                            }
                                        ]}
                                    />
                                </View>

                            </View>
                        );
                    })}

                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    iconBox: {
        backgroundColor: '#EEF2FF',
        padding: 9,
        borderRadius: 10,
    },

    headerContent: {
        flex: 1,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },

    subtitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 3,
    },

    expandButton: {
        width: 40,
        height: 40,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    subjectList: {
        marginTop: 18,
    },

    subjectItem: {
        marginBottom: 18,
    },

    subjectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    subjectInfo: {
        flex: 1,
    },

    subjectName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },

    topicCount: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 3,
    },

    averageText: {
        fontSize: 14,
        fontWeight: '700',
    },

    progressTrack: {
        height: 7,
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 10,
    },

    progressFill: {
        height: '100%',
        borderRadius: 8,
    },

});
