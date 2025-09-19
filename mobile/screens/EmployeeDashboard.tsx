import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import SideBar from '../components/SideBar';
import AdminHeaderBar from '../components/AdminHeaderBar';
import { supabase } from '../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp } from '@react-navigation/native';
import UserBox from '../components/UserBox';

const EmployeeDashboard = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  type User = {
    user_id: number; // Add this field
    full_name: string;
    email: string;
    role: string;
    hired_date: string;
    status: string;
    image_url: string;
  };

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      await fetchCounts();
      await fetchUsers();
      setLoading(false); // Stop loading
    };

    fetchData();
  }, []);

  const fetchCounts = async () => {
    try {
      const { count: totalUsersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      const { count: totalEmployeesCount, error: employeesError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'Employee');

      if (employeesError) throw employeesError;

      setUserCount(totalUsersCount);
      setEmployeeCount(totalEmployeesCount);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, full_name, email, role, hired_date, status, image_url')
        .eq('role', 'Employee');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRefresh = async () => {
    setLoading(true); // Start loading
    await fetchCounts();
    await fetchUsers();
    setLoading(false); // Stop loading
  };

  const handleEdit = (user: User) => {
    navigation.navigate('AddEmployeeDashboard', { user }); // Pass user data to AddEmployeeDashboard
  };

  return (
    <View style={styles.container}>
      <View>
        <SideBar activeItem="EmployeeDashboard" />
      </View>
      <View style={styles.content}>
        <AdminHeaderBar />
          <View style={styles.headerWrapper}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}># {userCount ?? 'N/A'} Users</Text>
              <TouchableOpacity
                style={styles.addButtonContainer}
                onPress={() => navigation.navigate('AddEmployeeDashboard')}
              >
                <LinearGradient
                  colors={['#402F23', '#594231', '#A67B5B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  locations={[0, 0.47, 1]}
                  style={styles.addButton}
                >
                  <Text style={styles.buttonText}>+ Add Employee</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}># {employeeCount ?? 'N/A'} Employees</Text>
          </View>
          {loading && <ActivityIndicator size="large" color="#A67B5B" />}
          <ScrollView style={styles.scrollView} removeClippedSubviews={true}>
            <View style={styles.gridContainer}>
              {users.map((user) => (
                <View key={user.user_id} style={styles.gridItem}>
                  <UserBox
                    user={user}
                    onDeleteSuccess={handleRefresh}
                    onEditPress={() => handleEdit(user)} // Pass user data to handleEdit
                  />
                </View>
              ))}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  addButtonContainer: {
    width: 150,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    marginTop: 20,
    backgroundColor: 'transparent', 
    borderWidth: 0, 
    shadowColor: 'transparent', 
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  gridItem: {
    width: '32%', // Slightly less than 33% to account for margins
    marginBottom: 15,
  },
  headerWrapper: {
    padding: 15, 
  },
});

export default EmployeeDashboard;