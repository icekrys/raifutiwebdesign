import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserOptionsMenu from './UserOptionsMenu';
import { supabase } from '../lib/supabase';

interface User {
  user_id: number; // Add this if you need it
  full_name: string;
  email: string;
  role: string;
  hired_date: string;
  status: string;
  image_url: string; // Changed from 'image' to 'image_url'
}

interface UserBoxProps {
  user: User;
  onDeleteSuccess?: () => void;
  onEditPress?: () => void;
}

const UserBox: React.FC<UserBoxProps> = ({ user, onDeleteSuccess, onEditPress }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [status, setStatus] = useState(user.status);

  const handleArchiveToggle = async () => {
    try {
      const newStatus = status === 'Active' ? 'Inactive' : 'Active';
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('email', user.email);

      if (error) throw error;

      setStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('email', user.email);

      if (error) throw error;

      Alert.alert('Success', 'User deleted successfully.');
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete user.');
    }
  };

  const handleOutsidePress = () => {
    if (showOptions) {
      setShowOptions(false);
    }
  };

  return (
    <Pressable onPress={handleOutsidePress} style={styles.container}>
      {/* Upper Section */}
      <View style={styles.upperSection}>
        {/* Left Side - Image and Name */}
        <View style={styles.leftSide}>
          <Image
            source={user.image_url ? { uri: user.image_url } : require('../assets/default-profile.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={styles.nameText}>{user.full_name}</Text>
        </View>
        
        {/* Right Side - Options Icon */}
        <TouchableOpacity onPress={() => setShowOptions(!showOptions)} style={styles.optionsButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
        </TouchableOpacity>
        {showOptions && (
          <View style={styles.optionsMenu}>
            <UserOptionsMenu
              onArchivePress={handleArchiveToggle}
              onDeletePress={handleDelete}
              onEditPress={onEditPress}
            />
          </View>
        )}
      </View>
      
      {/* Lower Section with light gray background */}
      <View style={styles.lowerSection}>
        {/* Upper part of lower section - Role and Date Hired */}
        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Role</Text>
            <Text style={styles.detailValue}>{user.role}</Text>
          </View>
          
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Date Hired</Text>
            <Text style={styles.detailValue}>{user.hired_date}</Text>
          </View>
        </View>
        
        {/* Lower part of lower section - Email and Status */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{status}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 8, // Adjusted for grid spacing
    width: '100%', // Ensure consistent width for three boxes per row
    height: 300, // Fixed height for uniformity
    aspectRatio: 1, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upperSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    zIndex: 1,
  },
  leftSide: {
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  optionsButton: {
    padding: 4,
    zIndex: 10,
  },
  lowerSection: {
    backgroundColor: '#f0f0f0', 
    padding: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailColumn: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, 
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  optionsMenu: {
    position: 'absolute',
    right: 25, 
    top: 40, 
    zIndex: 1000,
  },
});

export default UserBox;