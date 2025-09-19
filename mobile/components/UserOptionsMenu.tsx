import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserOptionsMenuProps {
  onArchivePress?: () => void;
  onDeletePress?: () => void;
  onEditPress?: () => void;
}

const UserOptionsMenu: React.FC<UserOptionsMenuProps> = ({ onArchivePress, onDeletePress, onEditPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optionRow} onPress={onArchivePress}>
        <Ionicons name="archive-outline" size={20} color="#333" />
        <Text style={styles.optionText}>Archive</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionRow} onPress={onDeletePress}>
        <Ionicons name="trash-outline" size={20} color="#333" />
        <Text style={styles.optionText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionRow} onPress={onEditPress}>
        <Ionicons name="create-outline" size={20} color="#333" />
        <Text style={styles.optionText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    position: 'absolute',
    right: -10, 
    top: 0, 
    zIndex: 1000,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    marginBottom: 4,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default UserOptionsMenu;
