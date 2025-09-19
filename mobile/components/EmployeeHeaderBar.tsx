import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../lib/supabase';

const EmployeeHeaderBar = () => {
  const [fullName, setFullName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async (activeSession: any) => {
      if (!activeSession) {
        setLoading(false);
        return;
      }

      const authUuid = activeSession.user.id;

      const { data: userRow, error } = await supabase
        .from('users')
        .select('full_name, image_url')
        .eq('auth_uuid', authUuid)
        .maybeSingle();

      if (!error && userRow) {
        setFullName(userRow.full_name);
        setProfileImage(userRow.image_url);
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

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{fullName ?? 'Unknown'}</Text>
        <Text style={styles.role}>Employee</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../assets/default-profile.png')}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

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
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  activityIndicator: {
    transform: [{ scale: 1.5 }],
  },
});

export default EmployeeHeaderBar;
