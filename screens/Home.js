
import React, { useState, useCallback } from 'react';

import {
    StyleSheet,
    View,
    Text,
    Pressable,
    ScrollView,
    StatusBar,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

import { getSubjectAverages } from '../services/subjects/subjectApi';

import DailyChallengeCard from '../components/cards/home/DailyChallengeCard';
import OverallAverageCard from '../components/cards/home/OverallAverageCard';
import SubjectAveragesCard from '../components/cards/home/SubjectAveragesCard';
import ProfileDropdown from '../components/cards/home/ProfileDropdown';

import {
    OverallAverageSkeleton,
    SubjectAveragesSkeleton,
} from '../components/cards/home/HomeSkeleton';

export default function Home({ navigation }) {

    const { user, logout } = useUser();

    const [averageData, setAverageData] = useState(null);
    const [averageLoading, setAverageLoading] = useState(true);

    // LOAD AVERAGES WHEN HOME SCREEN IS FOCUSED
    useFocusEffect(
        useCallback(() => {

            if (!user?.userId) {
                setAverageData(null);
                setAverageLoading(false);
                return;
            }

            let active = true;

            const loadAverages = async () => {

                setAverageLoading(true);

                try {
                    const data = await getSubjectAverages(user.userId);

                    if (active) {
                        setAverageData(data);
                    }

                } catch (error) {

                    console.log(
                        'Average Loading Error:',
                        error.message
                    );

                    if (active) {
                        setAverageData(null);
                    }

                } finally {

                    if (active) {
                        setAverageLoading(false);
                    }

                }
            };

            loadAverages();

            return () => {
                active = false;
            };

        }, [user?.userId])
    );

    // LOGOUT
    const handleLogout = () => {
        logout();
        navigation.replace('Login');
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F8FBFE"
            />

            <View style={styles.mainContainer}>

                {/* USER PROFILE HEADER */}
                <View style={styles.userHeader}>

                    <ProfileDropdown
                        user={user}
                        onEditProfile={() =>
                            navigation.navigate('EditProfile')
                        }
                        onAdminPanel={() =>
                            navigation.navigate('AdminPanel')
                        }
                        onLogout={handleLogout}
                    />

                </View>

                {/* OVERALL AND SUBJECT AVERAGES */}
                {averageLoading ? (

                    <>
                        <OverallAverageSkeleton />
                        <SubjectAveragesSkeleton />
                    </>

                ) : averageData ? (

                    <>
                        <OverallAverageCard
                            overallAverage={
                                averageData.overallAverage
                            }
                            subjectsWithScores={
                                averageData.subjectsWithScores
                            }
                            totalSubjects={
                                averageData.totalSubjects
                            }
                        />

                        <SubjectAveragesCard
                            subjects={averageData.subjects}
                        />
                    </>

                ) : (

                    <View style={styles.errorContainer}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={20}
                            color="#94A3B8"
                        />

                        <Text style={styles.errorText}>
                            Unable to load averages.
                        </Text>
                    </View>

                )}

                {/* DAILY CHALLENGE */}
                <DailyChallengeCard />

                {/* START QUIZ BUTTON */}
                <Pressable
                    style={({ pressed }) => [
                        styles.quizButton,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={() =>
                        navigation.navigate('Subject')
                    }
                >

                    <View style={styles.quizButtonContent}>

                        <Ionicons
                            name="play"
                            size={23}
                            color="#FFFFFF"
                        />

                        <Text style={styles.quizButtonText}>
                            Start Quiz!
                        </Text>

                    </View>

                </Pressable>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F8FBFE',
    },

    scrollContent: {
        flexGrow: 1,
    },

    mainContainer: {
        flex: 1,
        backgroundColor: '#F8FBFE',
    },

    userHeader: {
        flexDirection: 'row',
        backgroundColor: '#F8FBFE',
        marginTop: 50,
        height: 75,
        alignItems: 'center',
        width: '100%',
    },

    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    errorText: {
        fontSize: 13,
        color: '#64748B',
    },

    quizButton: {
        backgroundColor: '#495DF5',
        height: 52,
        marginHorizontal: 20,
        marginTop: 8,
        marginBottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },

    quizButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },

    quizButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '700',
    },

    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },

});
