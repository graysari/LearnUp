
import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TopicCard({
    topic,
    selected,
    onPress,
    getProgressColor
}) {
    const bestScore = topic.grade;
    const progress = bestScore == null
        ? 0
        : Math.max(0, Math.min(100, bestScore));

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                selected && styles.selectedCard,
                pressed && styles.pressed
            ]}
        >
            <View style={styles.header}>
                <View style={styles.topicInfo}>
                    <Text style={styles.topicName}>
                        {topic.topicName}
                    </Text>

                    <Text style={styles.description}>
                        {topic.topicDescription}
                    </Text>
                </View>

                <Ionicons
                    name={selected ? 'checkmark-circle' : 'chevron-forward'}
                    size={22}
                    color={selected ? '#6366F1' : '#52698C'}
                />
            </View>

            <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${progress}%`,
                                backgroundColor: getProgressColor(bestScore)
                            }
                        ]}
                    />
                </View>

                <Text style={styles.scoreText}>
                    {bestScore == null
                        ? 'No score yet'
                        : `Best score: ${bestScore}%`}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EDF2F7',
        elevation: 1,
    },

    selectedCard: {
        borderColor: '#6366F1',
        borderWidth: 2,
        backgroundColor: '#F8FAFF',
    },

    pressed: {
        opacity: 0.75,
        transform: [{ scale: 0.98 }],
    },

    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    topicInfo: {
        flex: 1,
        paddingRight: 12,
    },

    topicName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },

    description: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
        marginTop: 3,
    },

    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 12,
    },

    progressTrack: {
        flex: 1,
        height: 10,
        backgroundColor: '#E2E8F0',
        borderRadius: 10,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        borderRadius: 10,
    },

    scoreText: {
        fontSize: 12,
        color: '#52698C',
        textAlign: 'right',
        minWidth: 95,
    },
});
