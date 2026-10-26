
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

import { getSubjectAverages } from '../services/subjects/subjectApi';

import RecentAchievementsCard from '../components/cards/home/RecentAchievementsCard';
import DailyChallengeCard from '../components/cards/home/DailyChallengeCard';
import OverallAverageCard from '../components/cards/home/OverallAverageCard';
import SubjectAveragesCard from '../components/cards/home/SubjectAveragesCard';
import ProfileDropdown from '../components/cards/home/ProfileDropdown'


export default function Home({ navigation }) {
    const { user, logout, subjectDailyTask, setSubjectDailyTask } = useUser();

    const [averageData, setAverageData] = useState(null);
    const [averageLoading, setAverageLoading] = useState(true);


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

    return (
        <ScrollView>
            <View style={styles.mainContainer}>
                <View style={styles.userHeader}>
                    <ProfileDropdown
                        user={user}
                        onEditProfile={() => navigation.navigate('EditProfile')}
                        onAdminPanel={() => navigation.navigate('AdminPanel')}
                        onLogout={() => { 
                            logout();
                            navigation.replace('Login');
                        }}
                    />
                </View>



                {/* OVERALL AVERAGE AND SUBJECT AVERAGES */}
                {averageLoading && !averageData ? (
                    <Text style={{ color: '#64748B', marginBottom: 16 }}>
                        Loading averages...
                    </Text>
                ) : averageData ? (
                    <>
                        <OverallAverageCard
                            overallAverage={averageData.overallAverage}
                            subjectsWithScores={averageData.subjectsWithScores}
                            totalSubjects={averageData.totalSubjects}
                        />

                        <SubjectAveragesCard
                            subjects={averageData.subjects}
                        />
                    </>
                ) : (
                    <Text style={{ color: '#64748B', marginBottom: 16 }}>
                        Unable to load averages.
                    </Text>
                )}
                <DailyChallengeCard />

                <View>
                    <Pressable
                        style={({ pressed }) => [
                            styles.quizButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={() => navigation.navigate('Subject')}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons
                                name='play'
                                size={25}
                                color={'#EDF2F7'}>

                            </Ionicons>
                            <Text style={styles.quizButtonText}>Start Quiz!</Text>
                        </View>
                    </Pressable>
                </View>
            </View >
        </ScrollView>
    );
}
const styles = StyleSheet.create({


    logOutText: {
        color: '#f34a4af3',
        fontSize: 15,
        fontWeight: 'bold',

    },
    logoutContainer: {
        marginTop: 20,
        marginRight: 30,
        alignSelf: 'flex-end',

    },
    userIcon: {
        backgroundColor: '#DCEAFC',
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 23,
        marginRight: 10,
        marginLeft: 20,
    },
    userName: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    mainContainer: {
        backgroundColor: '#F8FBFE'
    },
    userHeader: {
        flexDirection: 'row',
        backgroundColor: '#F8FBFE',
        marginTop: 50,
        height: 75,
        alignItems: 'center',
        width: '100%'
    },
    quizButtonText: {

        fontSize: 20,
        color: '#EDF2F7',
        fontWeight: 'bold',
        marginLeft: 15
    },
    quizButton: {
        backgroundColor: '#495df5',
        height: 50,
        marginBottom:50,
        
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

    buttonPressed: {
        opacity: 0.6,
        transform: [{ scale: 0.95 }],
    },

});
