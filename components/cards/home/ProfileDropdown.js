import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    Image,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProfilePictureUrl } from '../../../utils/imageHelper'

export default function ProfileDropdown({
    user,
    onEditProfile,
    onAdminPanel,
    onLogout,
}) {
    const [expanded, setExpanded] = useState(false);

    const toggleDropdown = () => {
        setExpanded(prev => !prev);
    };

    const handleAction = (callback) => {
        setExpanded(false);
        callback?.();
    };

    return (
        <View style={styles.profileContainer}>
            <Pressable
                style={styles.profileHeader}
                onPress={toggleDropdown}
            >
                <View style={styles.avatarContainer}>
                    {user?.profilePicture ? (
                        <Image
                            source={{
                                uri: getProfilePictureUrl(user.profilePicture)
                            }}
                            style={styles.profileImage}
                            resizeMode="cover"
                            onLoad={() => {
                                console.log('IMAGE LOADED');
                            }}
                            onError={(e) => {
                                console.log('IMAGE ERROR:', e.nativeEvent.error);
                                console.log(
                                    'Failed URL:',
                                    getProfilePictureUrl(user.profilePicture)
                                );
                            }}
                        />
                    ) : (
                        <Ionicons
                            name="person"
                            size={30}
                            color="#6366F1"
                        />
                    )}
                </View>
                <View style={styles.profileDetails}>
                    <Text
                        style={styles.profileName}
                        numberOfLines={1}
                    >
                        {user?.lastName}, {user?.firstName}
                    </Text>

                    <Text style={styles.profileGrade}>
                        Grade {user?.grade === 13 ? 'Life Skills and General Knowledge' : user?.grade}
                    </Text>
                </View>

                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#6366F1"
                />
            </Pressable>

            {expanded && (
                <View style={styles.dropdownMenu}>

                    <Pressable
                        style={styles.menuItem}
                        onPress={() => handleAction(onEditProfile)}
                    >
                        <Ionicons
                            name="person-outline"
                            size={23}
                            color="#6366F1"
                        />

                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuTitle}>
                                Edit Profile
                            </Text>
                            <Text style={styles.menuDescription}>
                                Update personal information
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#94A3B8"
                        />
                    </Pressable>

                    <View style={styles.divider} />


                    {/* ADMIN */}

                    {user?.role === 'admin' && (
                        <>
                            <Pressable
                                style={styles.menuItem}
                                onPress={() => handleAction(onAdminPanel)}
                            >
                                <Ionicons
                                    name="shield-checkmark-outline"
                                    size={23}
                                    color="#6366F1"
                                />

                                <View style={styles.menuTextContainer}>
                                    <Text style={styles.menuTitle}>
                                        Admin Panel
                                    </Text>

                                    <Text style={styles.menuDescription}>
                                        Manage subjects, topics, and questions
                                    </Text>
                                </View>

                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#94A3B8"
                                />
                            </Pressable>

                            <View style={styles.divider} />
                        </>
                    )}

                    <View style={styles.divider} />

                    <Pressable
                        style={styles.menuItem}
                        onPress={() => handleAction(onLogout)}
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={23}
                            color="#EF4444"
                        />

                        <View style={styles.menuTextContainer}>
                            <Text
                                style={[
                                    styles.menuTitle,
                                    { color: '#EF4444' }
                                ]}
                            >
                                Log Out
                            </Text>
                            <Text style={styles.menuDescription}>
                                Sign out of your account
                            </Text>
                        </View>
                    </Pressable>

                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    profileContainer: {
        width: '100%',
        position: 'relative',
        zIndex: 100,
    },

    profileHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 12,
    },

    profileDetails: {
        flex: 1,
        minWidth: 0,
    },

    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },

    profileGrade: {
        fontSize: 15,
        color: '#64748B',
        marginTop: 3,
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        right: 15,
        width: 290,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 8,
        zIndex: 1000,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 12,
        gap: 12,
    },

    menuTextContainer: {
        flex: 1,
        minWidth: 0,
    },

    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },

    menuDescription: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 3,
    },

    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 12,
    },
});