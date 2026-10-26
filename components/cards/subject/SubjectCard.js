
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SubjectCard({ subject, onPress }) {


    const completedTopics = subject.passedTopicCount ?? 0;
    const totalTopics = subject.topicCount ?? 0;

    const progress = totalTopics > 0
        ? Math.min(100, (completedTopics / totalTopics) * 100)
        : 0;

    const getProgressColor = (percentage) => {
        if (percentage === 100) return '#22C55E'; // Green
        if (percentage >= 75) return '#8B5CF6';  // Purple
        if (percentage >= 50) return '#3B82F6';  // Blue
        return '#F59E0B';                        // Orange

       
    };
 const progressColor = getProgressColor(progress);
    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                pressed && styles.pressed
            ]}
            onPress={onPress}
        >
            {/* SUBJECT ICON */}
            <View style={styles.iconContainer}>
                <Ionicons
                    name={subject.icon || 'book-outline'}
                    size={32}
                    color="#6366F1"
                />
            </View>

            {/* SUBJECT DETAILS */}
            <View style={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.subjectName}>
                        {subject.name}
                    </Text>

                    <Ionicons
                        name="chevron-forward"
                        size={22}
                        color="#64748B"
                    />
                </View>

                {/* PROGRESS */}
                <View style={styles.progressRow}>

                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${progress}%`,
                                    backgroundColor: progressColor
                                },

                            ]}
                        />
                    </View>

                    <Text style={[styles.topicCount, { color: progressColor }]}>
                        {completedTopics}/{totalTopics} topics
                    </Text>

                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#EDF2F7',
        elevation: 2,
    },

    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },

    iconContainer: {
        width: 76,
        height: 76,
        backgroundColor: '#EEF2FF',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },

    content: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },

    subjectName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        flex: 1,
    },

    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    progressTrack: {
        flex: 1,
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#6366F1',
        borderRadius: 8,
    },

    topicCount: {
        fontSize: 12,
        color: '#64748B',
    },

});
