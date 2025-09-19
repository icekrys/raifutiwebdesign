import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AdminHeaderBar from '../components/AdminHeaderBar';
import SideBar from '../components/SideBar';

interface AdminDashboardProps {
  navigation: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigation }) => {
  
  return (
    <View style={styles.container}>
      <View>
        <SideBar />
      </View>
      <View style={styles.content}>
      <AdminHeaderBar />
        <ScrollView style={styles.mainContent}>
          {/* Dashboard Content */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Sales Today</Text>
              <Text style={styles.statValue}>12,450</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Total Orders</Text>
              <Text style={styles.statValue}>56</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Top Items</Text>
              <Text style={styles.statValue}>Lotte</Text>
            </View>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NOTIFICATIONS:</Text>
            {[...Array(5)].map((_, i) => (
              <Text key={i} style={styles.notificationItem}>{i+1}. New order from Table 2</Text>
            ))}
            <Text style={styles.viewAll}>View All</Text>
          </View>

          {/* Products Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Products</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statTitle: {
    color: '#7f8c8d',
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    color: '#2c3e50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  viewAll: {
    color: '#3498db',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default AdminDashboard;