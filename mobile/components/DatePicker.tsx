import React from 'react';
import { Platform, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export const DatePicker = ({ value, onChange, placeholder }: DatePickerProps) => {
  const [showPicker, setShowPicker] = React.useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onChange(formattedDate);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 40,
          borderColor: '#ccc', 
          borderWidth: 1,
          borderRadius: 5,
          paddingLeft: 10,
          paddingRight: 10,
          backgroundColor: '#fff',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      />
    );
  }

  return (
    <>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          value={value}
          editable={false}
          placeholder={placeholder}
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3, 
          }}
        />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </>
  );
};