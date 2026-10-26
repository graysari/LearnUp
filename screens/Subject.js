
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
    ActivityIndicator
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { getSubjectsWithProgress } from '../services/subjects/subjectApi';
import { useUser } from '../context/UserContext';
import SubjectCard from '../components/cards/subject/SubjectCard';

export default function Subject({ navigation }) {

    const { user } = useUser();

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;

        const fetchSubjects = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getSubjectsWithProgress(user.userId);

                if (active) {
                    setSubjects(data);
                }

            } catch (err) {
                if (active) {
                    setError('Unable to load subjects.');
                    console.log('Subjects Error:', err.message);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchSubjects();

        return () => {
            active = false;
        };
    }, []);

    // Display only subjects matching the logged-in user's grade
    const filteredSubjects = subjects.filter(
        subject => subject.gradeId === user?.grade
    );

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={26}
                        color="#0F172A"
                    />
                </Pressable>

                <Text style={styles.title}>
                    Choose a Subject
                </Text>

                <View style={styles.headerSpacer} />
            </View>

            <Text style={styles.subtitle}>
                Select a subject to view topics and start a quiz.
            </Text>

            {/* CONTENT */}
            {loading ? (

                <View style={styles.centerContent}>
                    <ActivityIndicator
                        size="large"
                        color="#6366F1"
                    />

                    <Text style={styles.statusText}>
                        Loading subjects...
                    </Text>
                </View>

            ) : error ? (

                <View style={styles.centerContent}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={42}
                        color="#EF4444"
                    />

                    <Text style={styles.statusText}>
                        {error}
                    </Text>

                    <Text style={styles.hintText}>
                        Check your server connection and try again.
                    </Text>
                </View>

            ) : (

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredSubjects.length > 0 ? (

                        filteredSubjects.map((subject) => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                onPress={() =>
                                    navigation.navigate('Topic', {
                                        subjectId: subject.id,
                                        subjectName: subject.name
                                    })
                                }
                            />
                        ))

                    ) : (

                        <View style={styles.centerContent}>
                            <Ionicons
                                name="book-outline"
                                size={42}
                                color="#94A3B8"
                            />

                            <Text style={styles.statusText}>
                                No subjects available.
                            </Text>
                        </View>

                    )}
                </ScrollView>

            )}

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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 12,
    },

    backButton: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    headerSpacer: {
        width: 35,
    },

    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
    },

    subtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 26,
        paddingHorizontal: 20,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 35,
        paddingHorizontal: 20,
    },

    statusText: {
        fontSize: 15,
        color: '#64748B',
        marginTop: 12,
        textAlign: 'center',
    },

    hintText: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 6,
        textAlign: 'center',
    },

});
