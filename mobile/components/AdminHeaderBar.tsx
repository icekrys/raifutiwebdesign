import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function AdminHeaderBar() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null); // New state for profile image

  useEffect(() => {
    const loadProfile = async (activeSession: any) => {
      if (!activeSession) {
        setLoading(false);
        return;
      }

      const jwtRole = activeSession.user.user_metadata?.role || null; // Retrieve role from metadata
      const authUuid = activeSession.user.id;

      setRole(jwtRole);

      if (jwtRole === 'Owner') {
        const { data: userRow, error } = await supabase
          .from('users')
          .select('full_name, image_url') // Fetch image_url along with full_name
          .eq('auth_uuid', authUuid)
          .maybeSingle();

        if (!error && userRow) {
          setFullName(userRow.full_name);
          setProfileImage(userRow.image_url); // Set profile image
        }
      }

      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      loadProfile(session);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator color="#fce42a" style={styles.activityIndicator} size="large" />
      </View>
    );
  }

  if (role !== 'Owner') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/default-profile.png')} // Use fetched image or default
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{fullName ?? 'Unknown'}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>
      
      <View style={styles.notificationContainer}>
        <Ionicons name="notifications" size={25} color="#fce42a" />
        <Text style={styles.notificationText}>Notification</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    height: 120, 
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 2,
  },
  role: {
    fontSize: 18,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 18,
    marginLeft: 4,
  },
  activityIndicator: {
    transform: [{ scale: 1.5 }], 
  },
});