
import React from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export default function AdminPanel({ navigation }) {
    const { user } = useUser();

    if (user?.role !== 'admin') {
        return (
            <View style={styles.accessDenied}>
                <Ionicons
                    name="lock-closed-outline"
                    size={48}
                    color="#EF4444"
                />

                <Text style={styles.accessDeniedTitle}>
                    Access Denied
                </Text>

                <Text style={styles.accessDeniedText}>
                    You do not have permission to access
                    the Admin Panel.
                </Text>

                <Pressable
                    onPress={() => navigation.goBack()}
                >
                    <Text style={{ color: '#6366F1' }}>
                        Go Back
                    </Text>
                </Pressable>
            </View>
        );
    }

    const menuItems = [
        {
            title: 'Subjects',
            description: 'Add, edit, and manage subjects',
            icon: 'book-outline',
            color: '#6366F1',
            backgroundColor: '#EEF2FF',
            screen: 'ManageSubjects',
        },
        {
            title: 'Topics',
            description: 'Add, edit, and manage topics',
            icon: 'layers-outline',
            color: '#22C55E',
            backgroundColor: '#DCFCE7',
            screen: 'ManageTopics',
        },
        {
            title: 'Questions',
            description: 'Add, edit, and manage questions',
            icon: 'list-outline',
            color: '#EF4444',
            backgroundColor: '#FEE2E2',
            screen: 'ManageQuestions',
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F7FAFC"
            />

            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#0F172A"
                    />
                </Pressable>

                <Text style={styles.headerTitle}>
                    Admin Panel
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Admin Overview */}
                <View style={styles.overviewCard}>
                    <View style={styles.adminIconBackground}>
                        <Ionicons
                            name="shield-checkmark"
                            size={30}
                            color="#6366F1"
                        />
                    </View>

                    <Text style={styles.overviewTitle}>
                        Admin Panel
                    </Text>

                    <Text style={styles.overviewDescription}>
                        Manage your learning content
                    </Text>
                </View>

                {/* Management Menu */}
                {menuItems.map((item) => (
                    <Pressable
                        key={item.title}
                        style={styles.menuCard}
                        onPress={() =>
                            navigation.navigate(item.screen)
                        }
                    >
                        <View
                            style={[
                                styles.menuIconContainer,
                                {
                                    backgroundColor:
                                        item.backgroundColor,
                                },
                            ]}
                        >
                            <Ionicons
                                name={item.icon}
                                size={28}
                                color={item.color}
                            />
                        </View>

                        <View style={styles.menuDetails}>
                            <Text style={styles.menuTitle}>
                                {item.title}
                            </Text>

                            <Text style={styles.menuDescription}>
                                {item.description}
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color="#6366F1"
                        />
                    </Pressable>
                ))}

                {/* Information Card */}
                <View style={styles.infoCard}>
                    <Ionicons
                        name="settings"
                        size={26}
                        color="#6366F1"
                    />

                    <View style={styles.infoDetails}>
                        <Text style={styles.infoTitle}>
                            Manage Learning Content
                        </Text>

                        <Text style={styles.infoDescription}>
                            You can add, edit, and manage
                            subjects, topics, and questions
                            for all grade levels.
                        </Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    accessDenied: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7FAFC',
        padding: 24,
    },

    accessDeniedTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
        marginTop: 16,
    },

    accessDeniedText: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
        gap: 18,
        marginTop: 20,
    },

    backButton: {
        padding: 4,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },

    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        gap: 14,
    },

    overviewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },

    adminIconBackground: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#E8ECFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    overviewTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },

    overviewDescription: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
    },

    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 18,
        gap: 16,
        minHeight: 110,
    },

    menuIconContainer: {
        width: 58,
        height: 58,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    menuDetails: {
        flex: 1,
        gap: 5,
    },

    menuTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0F172A',
    },

    menuDescription: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 19,
    },

    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EEF2FF',
        borderRadius: 18,
        padding: 20,
        marginTop: 8,
        gap: 14,
    },

    infoDetails: {
        flex: 1,
    },

    infoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 6,
    },

    infoDescription: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
    },
});
