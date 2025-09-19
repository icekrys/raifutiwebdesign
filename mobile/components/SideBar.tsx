import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation'; 

const SideBar: React.FC<{ activeItem?: keyof RootStackParamList }> = ({ activeItem }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: session } = await supabase.auth.getSession();
      const jwtRole = session?.session?.user?.user_metadata?.role || null;
      setRole(jwtRole);
    };

    fetchRole();
  }, []);

  const ownerMenuItems: { name: string; icon: keyof typeof Ionicons.glyphMap; route: keyof RootStackParamList }[] = [
      { name: 'Dashboard', icon: 'home-outline', route: 'AdminDashboard' },
      { name: 'Reports', icon: 'analytics-outline', route: 'MainScreen' },
      { name: 'Products', icon: 'cube-outline', route: 'ProductDashboard' },
      { name: 'Employee', icon: 'people-outline', route: 'EmployeeDashboard' },
      { name: 'Orders', icon: 'cart-outline', route: 'MainScreen' },
      { name: 'Logon Session', icon: 'time-outline', route: 'MainScreen' },
      { name: 'Notification', icon: 'notifications-outline', route: 'MainScreen' },
      { name: 'Shift Overview', icon: 'calendar-outline', route: 'MainScreen' },
  ];
  
  const employeeMenuItems: { name: string; icon: keyof typeof Ionicons.glyphMap; route: keyof RootStackParamList }[] = [
      { name: 'Point of Sale', icon: 'cash-outline', route: 'EmployeePOS' },
      { name: 'Activity Log', icon: 'clipboard-outline', route: 'MainScreen' },
      { name: 'Order Status', icon: 'list-outline', route: 'OrderStatus' },
      { name: 'QR Order Panel', icon: 'qr-code-outline', route: 'MainScreen' },
  ];

  const menuItems = role === 'Owner' ? ownerMenuItems : employeeMenuItems;

  const handleLogout = async () => {
    try {
      await supabase.auth.refreshSession();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel="Main navigation menu"
    >
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/logo.jpg')} 
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Application logo"
        />
      </View>
      
      {menuItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.menuItem, 
            (route.name === item.route || activeItem === item.route) && styles.activeMenuItem
          ]}
          onPress={() => navigation.navigate(item.route)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={item.name}
          accessibilityHint={`Navigates to ${item.name} screen`}
          accessibilityState={{
            selected: route.name === item.route || activeItem === item.route
          }}
        >
          <View style={styles.menuItemContent}>
            <Ionicons 
              name={item.icon} 
              size={20} 
              color="#FFFFFF" 
              accessible={false} 
            /> 
            <Text style={styles.menuText}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity 
        style={[styles.menuItem, styles.logoutButton]}
        onPress={handleLogout}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Logout"
        accessibilityHint="Signs out of the application"
      >
        <View style={styles.menuItemContent}>
          <Ionicons 
            name="log-out-outline" 
            size={20} 
            color="#FFFFFF" 
            accessible={false}
          />
          <Text style={styles.menuText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300, 
    backgroundColor: '#A67B5B',
    height: '100%',
  },
  logoContainer: {
    borderBottomWidth: 0,
    alignItems: 'center',
  },
  logo: {
    width: 300, 
    height: 120,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 55,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  activeMenuItem: {
    backgroundColor: '#744E31', 
  },
});

export default SideBar;