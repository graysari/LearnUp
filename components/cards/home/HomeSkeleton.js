
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function SkeletonBox({
    width = '100%',
    height = 12,
    radius = 6,
    style,
}) {
    const opacity = useRef(new Animated.Value(0.45)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.9,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.45,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius: radius,
                    backgroundColor: '#E2E8F0',
                    opacity,
                },
                style,
            ]}
        />
    );
}

// OVERALL AVERAGE
export function OverallAverageSkeleton() {
    return (
        <View style={styles.card}>

            <View style={styles.overallHeader}>
                <View style={styles.iconBox}>
                    <Ionicons
                        name="school-outline"
                        size={25}
                        color="#6366F1"
                    />
                </View>

                <Text style={styles.cardTitle}>
                    Overall Average
                </Text>
            </View>

            <View style={styles.overallBody}>

                <View style={styles.overallInfo}>
                    <SkeletonBox
                        width={100}
                        height={35}
                        radius={8}
                    />

                    <SkeletonBox
                        width="85%"
                        height={12}
                        style={{ marginTop: 12 }}
                    />

                    <SkeletonBox
                        width="75%"
                        height={11}
                        style={{ marginTop: 9 }}
                    />
                </View>

                <View style={styles.circleSkeleton}>
                    <SkeletonBox
                        width={62}
                        height={20}
                        radius={6}
                    />
                </View>

            </View>
        </View>
    );
}

// SUBJECT PERFORMANCE
export function SubjectAveragesSkeleton({
    subjectCount = 6,
}) {
    return (
        <View style={styles.card}>

            <View style={styles.subjectHeader}>

                <View style={styles.iconBox}>
                    <Ionicons
                        name="stats-chart"
                        size={25}
                        color="#6366F1"
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>
                        Subject Performance
                    </Text>

                    <Text style={styles.cardSubtitle}>
                        Average of attempted topics
                    </Text>
                </View>

                <Ionicons
                    name="chevron-up"
                    size={22}
                    color="#6366F1"
                />

            </View>

            <View style={styles.divider} />

            <View style={styles.subjectGrid}>
                {Array.from({
                    length: subjectCount,
                }).map((_, index) => (

                    <View
                        key={index}
                        style={styles.subjectItem}
                    >

                        <View style={styles.subjectNameRow}>
                            <SkeletonBox
                                width={15}
                                height={15}
                                radius={4}
                            />

                            <SkeletonBox
                                width="65%"
                                height={12}
                            />
                        </View>

                        <SkeletonBox
                            width={65}
                            height={27}
                            radius={6}
                            style={{ marginTop: 16 }}
                        />

                        <SkeletonBox
                            width="100%"
                            height={6}
                            radius={5}
                            style={{ marginTop: 10 }}
                        />

                        <SkeletonBox
                            width="80%"
                            height={10}
                            radius={5}
                            style={{ marginTop: 9 }}
                        />

                    </View>
                ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
                <Ionicons
                    name="information-circle-outline"
                    size={17}
                    color="#94A3B8"
                />

                <Text style={styles.footerText}>
                    Based on the best score for each attempted topic.
                </Text>
            </View>

        </View>
    );
}

// DAILY TASK
export function DailyTaskSkeleton() {
    return (
        <View style={styles.card}>

            <View style={styles.dailyHeader}>

                <View style={styles.dailyTitleRow}>
                    <Ionicons
                        name="calendar-outline"
                        size={25}
                        color="#6366F1"
                    />

                    <View>
                        <Text style={styles.cardTitle}>
                            Daily Task
                        </Text>

                        <SkeletonBox
                            width={110}
                            height={11}
                            style={{ marginTop: 8 }}
                        />
                    </View>
                </View>

                <SkeletonBox
                    width={105}
                    height={30}
                    radius={20}
                />

            </View>

            <SkeletonBox
                width="90%"
                height={14}
                style={{ marginTop: 24 }}
            />

            <View style={styles.progressRow}>
                <SkeletonBox
                    width={60}
                    height={27}
                />

                <SkeletonBox
                    width={130}
                    height={12}
                />
            </View>

            <SkeletonBox
                height={7}
                radius={6}
                style={{ marginTop: 16 }}
            />

            <View style={styles.dailyFooter}>
                <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color="#94A3B8"
                />

                <SkeletonBox
                    width="80%"
                    height={12}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 16,
        marginBottom: 14,
        width: '100%',
    },

    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },

    cardSubtitle: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 5,
    },

    // OVERALL AVERAGE
    overallHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    overallBody: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },

    overallInfo: {
        flex: 1,
        justifyContent: 'center',
    },

    circleSkeleton: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 9,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },

    // SUBJECT PERFORMANCE
    subjectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginTop: 16,
        marginBottom: 16,
    },

    subjectGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 24,
    },

    subjectItem: {
        width: '47%',
    },

    subjectNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    footerText: {
        fontSize: 10,
        color: '#94A3B8',
        flex: 1,
    },

    // DAILY TASK
    dailyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    dailyTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
    },

    dailyFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        marginTop: 18,
    },

});
