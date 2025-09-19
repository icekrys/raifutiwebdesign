import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye as faEyeRegular, faEyeSlash as faEyeSlashRegular } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleLogin = async () => {
    try {
      setEmailTouched(false);
      setPasswordTouched(false);
  
      // Input validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !password) {
        if (!email) setEmailTouched(true);
        if (!password) setPasswordTouched(true);
        setError(!email && !password ? 'Email and Password are required' : !email ? 'Email is required' : 'Password is required');
        return;
      }
      if (!emailRegex.test(email)) {
        setEmailTouched(true);
        setError('Please enter a valid email address');
        return;
      }
  
      setLoading(true);
      setError('');
  
      // Authenticate user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
  
      // Retrieve session
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
  
      if (!session) {
        throw new Error('Session not found after authentication.');
      }
  
      // Fetch user data
      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('role')
        .eq('auth_uuid', session.user.id)
        .maybeSingle();
  
      if (userFetchError) {
        setLoading(false);
        throw userFetchError;
      }
  
      if (!userData) {
        throw new Error('User account not found in system. Please contact administrator.');
      }
  
      // Navigate based on user role
      if (userData.role === 'Owner') {
        navigation.replace('AdminDashboard');
      } else if (userData.role === 'Employee') {
        navigation.replace('EmployeePOS');
      } else {
        throw new Error('No valid role assigned');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (value: string, touched: boolean) => [
    styles.input,
    { borderColor: touched && !value ? 'red' : '#ccc', borderWidth: touched && !value ? 1 : 0 },
  ];

  const passwordInputStyle = (value: string, touched: boolean) => [
    styles.passwordInputContainer,
    { borderColor: touched && !value ? 'red' : '#ccc', borderWidth: touched && !value ? 1 : 0 },
  ];

  return (
    <View style={styles.container}>
      {/* Left Panel - Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/signage.jpg')} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      {/* Right Panel - Login Form */}
      <View style={styles.formContainer}>
        <LinearGradient
          colors={['#efe6d7', '#c6cfcd']}
          style={styles.gradientBackground}
        >
          <View style={styles.formContent}>
            <Text style={styles.title}>WELCOME BACK</Text>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[inputStyle(email, emailTouched), { outlineWidth: 0 }]}
                placeholder=""
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (text) setEmailTouched(false);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus={false}
                blurOnSubmit={false} 
                allowFontScaling={false}
                underlineColorAndroid="transparent"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={passwordInputStyle(password, passwordTouched)}>
                <TextInput
                  style={[styles.passwordInput, { outlineWidth: 0 }]}
                  placeholder=""
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (text) setPasswordTouched(false);
                  }}
                  secureTextEntry={!showPassword}
                  autoFocus={false}
                  blurOnSubmit={false} 
                  allowFontScaling={false}
                  underlineColorAndroid="transparent"
                />
                <TouchableOpacity 
                  style={[styles.passwordToggle, { outlineWidth: 0 }]}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon
                    style={{ outlineWidth: 0 }} 
                    icon={(showPassword ? faEyeSlashRegular : faEyeRegular) as IconProp} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              style={styles.loginButtonContainer}
            >
              <LinearGradient
                colors={['#402F23', '#594231', '#A67B5B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                locations={[0, 0.47, 1]}
                style={styles.loginButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Log In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1,
    maxWidth: 500,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  formContent: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff5252',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 0,
    borderBottomWidth: 0,
    elevation: 0,
    includeFontPadding: false,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 0,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 0,
    borderBottomWidth: 0,
    elevation: 0,
    includeFontPadding: false,
  },
  passwordToggle: {
    padding: 15,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#A67B5B',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButtonContainer: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loginButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;