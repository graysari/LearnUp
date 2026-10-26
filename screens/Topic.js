
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Pressable,
    ToastAndroid
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { getTopicWithGrades } from '../services/topics/topicApi';
import { useUser } from '../context/UserContext';
import SkeletonLoader from '../components/SkeletonLoader';
import TopicCard from '../components/cards/topic/TopicCard';

export default function Topic({ navigation, route }) {

    const { user } = useUser();

    const { subjectId, subjectName } = route.params;

    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState([]);

    const fetchTopics = async () => {
        try {
            setLoading(true);

            const data = await getTopicWithGrades(
                subjectId,
                user.userId
            );

            setTopics(data);

        } catch (error) {
            console.log('Error fetching topics:', error);

            ToastAndroid.show(
                'Unable to load topics.',
                ToastAndroid.SHORT
            );
        } finally {
            setLoading(false);
        }
    };

    const getProgressColor = (score) => {
        if (score === null || score === undefined) {
            return '#94A3B8';
        }

        if (score === 100) {
            return '#22C55E';
        }

        if (score > 75) {
            return '#3B82F6';
        }

        return '#8B5CF6';
    };

    useEffect(() => {
        if (user?.userId != null) {
            fetchTopics();
        }
    }, [subjectId, user?.userId]);

    const handleTopicPress = (topic) => {

        if (topic.questionCount <= 0) {
            ToastAndroid.show(
                'There are no questions in this topic yet.',
                ToastAndroid.SHORT
            );
            return;
        }

        navigation.replace('Question', {
            topicId: topic.topicId,
            totalQuestionCount: topic.questionCount
        });
    };

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>

                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="chevron-back"
                        size={26}
                        color="#0F172A"
                    />
                </Pressable>

                <View style={styles.headerText}>
                    <Text style={styles.title}>
                        {subjectName}
                    </Text>

                    <Text style={styles.subtitle}>
                        Choose a topic to start a quiz.
                    </Text>
                </View>

                <View style={styles.headerSpacer} />

            </View>

            {/* TOPIC LIST */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {loading ? (

                    Array.from({ length: 5 }).map((_, index) => (
                        <View
                            key={index}
                            style={styles.skeletonCard}
                        >
                            <SkeletonLoader
                                width="65%"
                                height={20}
                                borderRadius={6}
                            />

                            <View style={{ marginTop: 10, gap: 6 }}>
                                <SkeletonLoader
                                    width="95%"
                                    height={14}
                                />

                                <SkeletonLoader
                                    width="75%"
                                    height={14}
                                />
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <SkeletonLoader
                                    width="100%"
                                    height={10}
                                    borderRadius={10}
                                />
                            </View>
                        </View>
                    ))

                ) : topics.length === 0 ? (

                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="book-outline"
                            size={40}
                            color="#94A3B8"
                        />

                        <Text style={styles.emptyText}>
                            No topics available.
                        </Text>
                    </View>

                ) : (

                    topics.map((topic) => (
                        <TopicCard
                            key={topic.topicId}
                            topic={topic}
                            getProgressColor={getProgressColor}
                            onPress={() => handleTopicPress(topic)}
                        />
                    ))

                )}

            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },

    backButton: {
        width: 36,
        alignItems: 'flex-start',
    },

    headerText: {
        flex: 1,
        alignItems: 'center',
    },

    headerSpacer: {
        width: 36,
    },

    title: {
        fontSize: 19,
        fontWeight: '700',
        color: '#0F172A',
    },

    subtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 8,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 18,
        paddingBottom: 30,
    },

    skeletonCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EDF2F7',
        minHeight: 120,
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },

    emptyText: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 12,
    },

});
