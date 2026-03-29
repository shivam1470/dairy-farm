import { useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import React from 'react';

const quickActions = [
  { id: '1', title: 'Add Milk', icon: '🥛', route: '/add-milk' },
  { id: '2', title: 'Animals', icon: '🐄', route: '/animals' },
  { id: '3', title: 'Tasks', icon: '✓', route: '/tasks' },
  { id: '4', title: 'Workers', icon: '👥', route: '/workers' },
  { id: '5', title: 'Expenses', icon: '💰', route: '/expenses' },
  { id: '6', title: 'Vet Visit', icon: '🏥', route: '/vet' },
];

const recentActivities = [
  { id: '1', title: 'Morning milking completed', time: '2 hours ago' },
  { id: '2', title: 'A001 - Vet visit scheduled', time: '3 hours ago' },
  { id: '3', title: 'Feed stock updated', time: '5 hours ago' },
];

const ActionCard = React.memo(({ action, onPress }: any) => (
  <TouchableOpacity 
    key={action.id} 
    style={styles.actionCard} 
    activeOpacity={0.7}
    onPress={() => onPress(action.route)}
  >
    <Text style={styles.actionIcon}>{action.icon}</Text>
    <Text style={styles.actionTitle}>{action.title}</Text>
  </TouchableOpacity>
));
ActionCard.displayName = 'ActionCard';

const ActivityItem = React.memo(({ activity }: any) => (
  <View key={activity.id} style={styles.activityItem}>
    <View style={styles.activityDot} />
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{activity.title}</Text>
      <Text style={styles.activityTime}>{activity.time}</Text>
    </View>
  </View>
));
ActivityItem.displayName = 'ActivityItem';

const StatCard = React.memo(({ label, value, trend }: any) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statTrend}>{trend}</Text>
  </View>
));
StatCard.displayName = 'StatCard';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  const handleLogout = useCallback(async () => {
    await clearAuth();
    router.replace('/login');
  }, [clearAuth, router]);

  const handleActionPress = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  if (!user) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, {user.name}!</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard label="Total Animals" value="12" trend="+2 this month" />
        <StatCard label="Today's Milk" value="250L" trend="+5% vs yesterday" />
        <StatCard label="This Week Revenue" value="₹15K" trend="+8%" />
        <StatCard label="Pending Tasks" value="8" trend="3 urgent" />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <ActionCard key={action.id} action={action} onPress={handleActionPress} />
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2e7d32',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e8f5e9',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statTrend: {
    fontSize: 11,
    color: '#4caf50',
    marginTop: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  activityItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2e7d32',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
