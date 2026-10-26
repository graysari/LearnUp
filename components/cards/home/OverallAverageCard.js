
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';


export default function OverallAverageCard({
    overallAverage,
    subjectsWithScores,
    totalSubjects
}) {

    const hasGrade = overallAverage !== null &&
        overallAverage !== undefined;

    const percentage = hasGrade
        ? Math.max(0, Math.min(100, overallAverage))
        : 0;

    const circleSize = 100;
    const strokeWidth = 9;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset =
        circumference * (1 - percentage / 100);

    return (
        <View style={styles.card}>

            <View style={styles.header}>
                <View style={styles.iconBox}>
                    <Ionicons
                        name="school-outline"
                        size={22}
                        color="#6366F1"
                    />
                </View>

                <Text style={styles.title}>
                    Overall Average
                </Text>
            </View>

            <View style={styles.content}>

                <View style={styles.scoreSection}>
                    <Text style={styles.score}>
                        {hasGrade
                            ? `${overallAverage.toFixed(1)}%`
                            : '—'}
                    </Text>

                    <Text style={styles.description}>
                        {subjectsWithScores} of {totalSubjects} subjects graded
                    </Text>

                    <Text style={styles.caption}>
                        Based on attempted topics
                    </Text>
                </View>

                <View style={styles.circleContainer}>

                    <Svg
                        width={circleSize}
                        height={circleSize}
                        viewBox={`0 0 ${circleSize} ${circleSize}`}
                    >
                        {/* BACKGROUND CIRCLE */}
                        <Circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={radius}
                            stroke="#E2E8F0"
                            strokeWidth={strokeWidth}
                            fill="none"
                        />

                        {/* ACTUAL PROGRESS */}
                        <Circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={radius}
                            stroke="#6366F1"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${circleSize / 2}, ${circleSize / 2}`}
                        />
                    </Svg>

                    <View style={styles.circleLabel}>
                        <Text style={styles.circleText}>
                            {hasGrade
                                ? `${Math.round(overallAverage)}%`
                                : '—'}
                        </Text>
                    </View>

                </View>

            </View>

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

    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },

    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 18,
    },

    scoreSection: {
        flex: 1,
    },

    score: {
        fontSize: 34,
        fontWeight: '800',
        color: '#6366F1',
    },

    description: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
    },

    caption: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },

    circleContainer: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        marginTop:-60
    },

    circleLabel: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },

    circleText: {
        fontSize: 19,
        fontWeight: '700',
        color: '#0F172A',
    },

    progressTrack: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 18,
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#6366F1',
        borderRadius: 8,
    },

});
