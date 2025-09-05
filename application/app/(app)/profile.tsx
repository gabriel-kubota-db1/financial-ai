import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { onLogout, authState } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => onLogout!() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{authState?.user?.name}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{authState?.user?.email}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color={COLORS.white} size={20} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.primary,
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  infoLabel: {
    fontFamily: FONT.regular,
    color: COLORS.gray,
    fontSize: SIZES.small,
  },
  infoValue: {
    fontFamily: FONT.semiBold,
    color: COLORS.primary,
    fontSize: SIZES.medium,
    marginTop: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.red,
    paddingVertical: 15,
    borderRadius: SIZES.small,
    marginTop: 30,
    gap: 10,
  },
  logoutButtonText: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});
