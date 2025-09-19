import React from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from './lib/supabase';

export default class ErrorBoundary extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught:', error);
    this.handleReset();
  }

  handleReset = async () => {
    try {
      await supabase.auth.signOut(); // Ensure compatibility with updated client
      this.setState({ hasError: false });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong.</Text>
          <Button 
            title="Return to Login" 
            onPress={this.handleReset} 
          />
        </View>
      );
    }
    return this.props.children;
  }
}