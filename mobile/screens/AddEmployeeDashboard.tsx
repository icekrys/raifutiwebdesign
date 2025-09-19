import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import SideBar from '../components/SideBar';
import AdminHeaderBar from '../components/AdminHeaderBar';
import { supabase } from '../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { DatePicker } from '../components/DatePicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye as faEyeRegular, faEyeSlash as faEyeSlashRegular } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEmployeeDashboard'>;

const AddEmployeeDashboard = ({ navigation, route }: Props) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    hired_date: '',
    image_url: null as string | null,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showErrors, setShowErrors] = useState(false); // New state to control error visibility

  useEffect(() => {
    if (route.params?.user) {
      const { full_name, email, hired_date, image_url, user_id } = route.params.user;
      setFormData({
        fullName: full_name,
        email,
        password: '',
        hired_date: hired_date || '',
        image_url: image_url || null,
      });
      
      if (image_url) {
        setSelectedImage(image_url);
      }
    }
  }, [route.params?.user]);

  const validateInput = (name: string, value: string): string => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (!/^[a-zA-Z\s.]+$/.test(value.trim())) return "Invalid full name";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address";
        return "";
      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });

    // Validate input on change
    const error = validateInput(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const pickImage = async () => {
    setUploading(true);
    
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const img = result.assets[0];
        setSelectedImage(img.uri);
        
        // Convert image to blob for upload
        const response = await fetch(img.uri);
        const blob = await response.blob();
        
        // Create unique file path
        const fileName = `${Math.random()}.jpg`;
        const filePath = `employee-avatars/${fileName}`;

        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from('avatars')
          .upload(filePath, blob, { 
            contentType: 'image/jpeg',
            upsert: true
          });

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // Update form data with image URL
        setFormData({
          ...formData,
          image_url: publicUrl
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setFormData({
      ...formData,
      image_url: null
    });
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();
  
      if (error && error.code !== "PGRST116") {
        // Ignore "No rows found" error (PGRST116), as it means the email is not taken
        throw error;
      }
  
      return !!data; // Return true if email exists, false otherwise
    } catch (error) {
      console.error("Error checking email existence:", error);
      Alert.alert("Error", "Failed to validate email. Please try again.");
      return true; // Assume email exists in case of an error
    }
  };

  const handleSave = async () => {
    const isEditing = !!route.params?.user;
  
    // Validate all fields
    const newErrors = {
      fullName: validateInput("fullName", formData.fullName),
      email: validateInput("email", formData.email),
      password: isEditing ? "" : validateInput("password", formData.password),
    };
  
    setErrors(newErrors);
    setShowErrors(true); // Show errors only after the save button is pressed
  
    // Check if there are any validation errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }
  
    // Check if email already exists in the database
    if (!isEditing && formData.email) {
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email is already taken",
        }));
        return;
      }
    }
  
    setIsLoading(true);
    try {
      const userData = {
        full_name: formData.fullName,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
        hired_date: formData.hired_date || null,
        image_url: formData.image_url,
        role: "Employee",
        status: "Active",
      };
  
      let error;
      if (isEditing) {
        const userId = route.params.user.user_id;
        if (!userId) throw new Error("User ID is required for editing");
  
        const response = await supabase
          .from("users")
          .update(userData)
          .eq("user_id", userId);
  
        error = response.error;
      } else {
        const response = await supabase.from("users").insert(userData);
        error = response.error;
      }
  
      if (error) throw error;
  
      navigation.navigate("EmployeeDashboard");
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SideBar activeItem="EmployeeDashboard" />
      <View style={styles.content}>
        <AdminHeaderBar />
        <View style={styles.mainContent}>
          <Text style={styles.title}>Add New Employee</Text>
          <View style={styles.formContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, showErrors && errors.fullName && styles.inputError]}
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
                placeholder="Enter full name"
              />
              {showErrors && errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, showErrors && errors.email && styles.inputError]}
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter a valid email"
              />
              {showErrors && errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

              <View style={styles.passwordFieldContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={[
                  styles.passwordInputWrapper,
                  isPasswordFocused && styles.inputFocused,
                  showErrors && errors.password && styles.inputError
                ]}>
                  <TextInput
                    style={[styles.passwordInput, { outlineWidth: 0 }]}
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    placeholder="Minimum 8 characters"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    style={[styles.passwordToggle, { outlineWidth: 0 }]}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon
                      style={{ outlineWidth: 0 }}
                      icon={(showPassword ? faEyeSlashRegular : faEyeRegular) as IconProp}
                      size={20}
                      color={isPasswordFocused ? '#000' : '#999'}
                    />
                  </TouchableOpacity>
                </View>
                {showErrors && errors.password ? (
                  <Text style={[styles.errorText, { marginTop: 5 }]}>
                    {errors.password}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.label}>Work Date (Optional)</Text>
              <DatePicker
                value={formData.hired_date}
                onChange={(date) => handleInputChange('hired_date', date)}
                placeholder="YYYY-MM-DD"
              />
            </View>
                
            <View style={styles.rightContainer}>
              <View style={styles.imagePlaceholder}>
                {selectedImage ? (
                  <Image 
                    source={{ uri: selectedImage }} 
                    style={styles.selectedImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.placeholderText}>No Image Selected</Text>
                )}
              </View>

              {/* Image Picker Buttons */}
              <View style={styles.imagePickerContainer}>
                {selectedImage ? (
                  <View style={styles.imageActions}>
                    <TouchableOpacity onPress={pickImage} disabled={uploading}>
                      <Text style={styles.plainButtonText}>
                        {uploading ? 'Uploading...' : '+ Change Image'}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.separator}>||</Text>
                    <TouchableOpacity onPress={removeImage} disabled={uploading}>
                      <Text style={styles.plainButtonText}>- Remove Image</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={pickImage} disabled={uploading}>
                    <Text style={styles.plainButtonText}>
                      {uploading ? 'Uploading...' : '+ Add Image'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => navigation.navigate('EmployeeDashboard')}
                  disabled={isLoading || uploading}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButtonContainer}
                  onPress={handleSave}
                  disabled={isLoading || uploading}
                >
                  <LinearGradient
                    colors={['#402F23', '#594231', '#A67B5B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>
                      {isLoading ? 'Processing...' : '+ Save'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  leftContainer: {
    flex: 1.2,
    paddingRight: 10,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF0000',
  },
  passwordFieldContainer: {
    marginBottom: 15,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    paddingRight: 5,
  },
  passwordToggle: {
    padding: 10,
  },
  imagePlaceholder: {
    width: 390,
    height: 340,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 0, 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  imageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  plainButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 15,
  },
  separator: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    width: 80,
    height: 50,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonContainer: {
    width: 120,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  saveButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputFocused: {
    borderWidth: 2, 
    borderColor: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default AddEmployeeDashboard;