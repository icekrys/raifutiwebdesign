import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './lib/supabase';
import { useEffect, useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import AdminDashboard from './screens/AdminDashboard';
import EmployeeDashboard from './screens/EmployeeDashboard';
import ProductDashboard from './screens/ProductDashboard';
import EmployeePOS from './screens/EmployeePOS';
import TotalCashPOS from './screens/TotalCashPOS';
import PrintReceiptPOS from './screens/PrintReceiptPOS';
import AddEmployeeDashboard from './screens/AddEmployeeDashboard';
import OrderStatus from './screens/OrderStatus'; // Import the OrderStatus screen
import { Session } from '@supabase/supabase-js';
import ErrorBoundary from './ErrorBoundary';
import { View, ActivityIndicator, StyleSheet, Text, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastVisitedRoute, setLastVisitedRoute] = useState('Login');

  useEffect(() => {
    const initializeApp = async () => {
      // Check if there's a stored last visited route
      const storedRoute = await AsyncStorage.getItem('lastVisitedRoute');
      if (storedRoute) {
        setLastVisitedRoute(storedRoute);
      }

      // Fetch the initial session (if any)
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      setLoading(false); // Mark loading as complete
    };

    initializeApp();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const handleNavigation = async (routeName: string) => {
    setLastVisitedRoute(routeName);
    await AsyncStorage.setItem('lastVisitedRoute', routeName);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A67B5B" />
        <Text style={styles.loadingText}>Loading App...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <StatusBar backgroundColor="#2c3e50" />
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName={lastVisitedRoute}
            screenListeners={({ route }) => ({
              state: (e) => {
                // Store the current route whenever it changes
                if (route?.name) {
                  handleNavigation(route.name);
                }
              },
            })}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
            {session && (
              <>
                <Stack.Screen 
                  name="AdminDashboard" 
                  component={AdminDashboard} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="EmployeeDashboard" 
                  component={EmployeeDashboard} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="ProductDashboard" 
                  component={ProductDashboard} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="EmployeePOS" 
                  component={EmployeePOS} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="TotalCashPOS" 
                  component={TotalCashPOS} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="PrintReceiptPOS" 
                  component={PrintReceiptPOS} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="AddEmployeeDashboard" 
                  component={AddEmployeeDashboard as React.ComponentType<any>} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="OrderStatus" 
                  component={OrderStatus} 
                  options={{ headerShown: false }} 
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});