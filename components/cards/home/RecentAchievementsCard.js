
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecentAchievementsCard({ navigation }) {

    return (
        <View style={styles.achievementsCard}>
            <View style={styles.achievementsHeader}>
                <Text style={styles.achievementsTitle}>
                    Recent Achievements
                </Text>

                <Pressable
                    style={styles.viewAllButton}
                    onPress={() => navigation.navigate('Achievements')}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#6366F1"
                    />
                </Pressable>
            </View>

            <View style={styles.achievementItem}>
                <View style={[styles.achievementIcon, styles.perfectScoreBg]}>
                    <Ionicons name="trophy-outline" size={32} color="#F5A400" />
                </View>

                <View style={styles.achievementContent}>
                    <View style={styles.achievementTitleRow}>
                        <Text style={styles.achievementName}>Perfect Score!</Text>
                        <Text style={styles.achievementDate}>Oct 21</Text>
                    </View>
                    <Text style={styles.achievementDescription}>
                        You got 100% in Multiplication (Mathematics).
                    </Text>
                </View>
            </View>

            <View style={styles.achievementDivider} />

            <View style={styles.achievementItem}>
                <View style={[styles.achievementIcon, styles.highScoreBg]}>
                    <Ionicons name="stats-chart" size={32} color="#2684F5" />
                </View>

                <View style={styles.achievementContent}>
                    <View style={styles.achievementTitleRow}>
                        <Text style={styles.achievementName}>New High Score!</Text>
                        <Text style={styles.achievementDate}>Oct 20</Text>
                    </View>
                    <Text style={styles.achievementDescription}>
                        You beat your previous score in Respiratory System (Science).
                    </Text>
                </View>
            </View>

            <View style={styles.achievementDivider} />

            <View style={styles.achievementItem}>
                <View style={[styles.achievementIcon, styles.streakBg]}>
                    <Ionicons name="star" size={32} color="#F43F75" />
                </View>

                <View style={styles.achievementContent}>
                    <View style={styles.achievementTitleRow}>
                        <Text style={styles.achievementName}>
                            2-Day Learning Streak!
                        </Text>
                        <Text style={styles.achievementDate}>Oct 19</Text>
                    </View>
                    <Text style={styles.achievementDescription}>
                        You completed your daily challenge 2 days in a row.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    achievementsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',

    elevation: 2,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
},

achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
},

achievementsTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 1,
},

viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 8,
},

viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
},

achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 8,
},

achievementIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
},

perfectScoreBg: {
    backgroundColor: '#FFFAEB',
},

highScoreBg: {
    backgroundColor: '#EAF5FF',
},

streakBg: {
    backgroundColor: '#FFF0F5',
},

achievementContent: {
    flex: 1,
    paddingTop: 4,
},

achievementTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
},

achievementName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
},

achievementDate: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
},

achievementDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
    marginTop: 4,
},

achievementDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 88,
    marginVertical: 8,
},
});