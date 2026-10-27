
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
                        name="stats-chart"
                        size={20}
                        color="#6366F1"
                    />
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.title}>
                        Subject Performance
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
                        size={20}
                        color="#6366F1"
                    />
                </Pressable>

            </View>

            {/* SUBJECT LIST */}
            {expanded && (
                <>
                    <View style={styles.divider} />

                    <View style={styles.subjectList}>

                        {subjects.map((subject) => {

                            const average = subject.averageGrade;

                            const hasGrade =
                                average !== null &&
                                average !== undefined;

                            const color = getProgressColor(average);

                            const progress = hasGrade
                                ? Math.max(0, Math.min(100, average))
                                : 0;

                            return (
                                <View
                                    key={subject.id}
                                    style={styles.subjectItem}
                                >

                                    {/* SUBJECT NAME */}
                                    <View style={styles.subjectHeader}>

                                        <Ionicons
                                            name={
                                                subject.icon ||
                                                'book-outline'
                                            }
                                            size={14}
                                            color="#6366F1"
                                        />

                                        <Text
                                            style={styles.subjectName}
                                            numberOfLines={2}
                                        >
                                            {subject.name}
                                        </Text>

                                    </View>

                                    {/* AVERAGE */}
                                    <Text style={styles.averageText}>
                                        {hasGrade
                                            ? `${Number(average).toFixed(0)}%`
                                            : '—'}
                                    </Text>

                                    {/* PROGRESS BAR */}
                                    <View style={styles.progressTrack}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    width: `${progress}%`
                                                }
                                            ]}
                                        />
                                    </View>

                                    {/* TOPIC COUNT */}
                                    <Text style={styles.topicCount}>
                                        {subject.takenTopicCount} of{' '}
                                        {subject.topicCount} topics attempted
                                    </Text>

                                </View>
                            );
                        })}

                    </View>

                    {/* FOOTER */}
                    <View style={styles.footer}>

                        <Ionicons
                            name="information-circle-outline"
                            size={14}
                            color="#94A3B8"
                        />

                        <Text style={styles.footerText}>
                            Based on the best score for each attempted topic.
                        </Text>

                    </View>
                </>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
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
        width: 40,
        height: 40,
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerContent: {
        flex: 1,
    },

    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },

    subtitle: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 4,
    },

    expandButton: {
        width: 28,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },

    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginTop: 18,
        marginBottom: 22,
    },

    subjectList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 26,
    },

    subjectItem: {
        width: '47%',
    },

    subjectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        minHeight: 20,
    },

    subjectName: {
        fontSize: 11,
        fontWeight: '600',
        color: '#334155',
        flexShrink: 1,
    },

    averageText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#6366F1',
        marginTop: 8,
        marginBottom: 9,
    },

    progressTrack: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 10,
        overflow: 'hidden',
        width: '100%',
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#6366F1',
        borderRadius: 10,
    },

    topicCount: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 7,
    },

    footer: {
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        marginTop: 28,
        paddingTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },

    footerText: {
        fontSize: 10,
        color: '#94A3B8',
        flexShrink: 1,
    },

});
 