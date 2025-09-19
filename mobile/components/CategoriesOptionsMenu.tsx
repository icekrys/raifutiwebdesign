import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CategoriesOptionsMenuProps {
  onMilkteaPress?: () => void;
  onCoffeePress?: () => void;
  onDessertsPress?: () => void;
}

const CategoriesOptionsMenu: React.FC<CategoriesOptionsMenuProps> = ({
  onMilkteaPress,
  onCoffeePress,
  onDessertsPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optionRow} onPress={onMilkteaPress}>
        <Text style={styles.optionText}>Milktea</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionRow} onPress={onCoffeePress}>
        <Text style={styles.optionText}>Coffee</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionRow} onPress={onDessertsPress}>
        <Text style={styles.optionText}>Desserts</Text>
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
    paddingVertical: 6,
    paddingHorizontal: 20,
    position: 'absolute',
    right: -10,
    top: 0,
    zIndex: 1000,
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    marginHorizontal: 4, 
    minWidth: 80, 
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CategoriesOptionsMenu;