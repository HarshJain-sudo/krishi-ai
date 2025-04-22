import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '../../constants/theme';

export const Header = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="menu" size={24} color={COLORS.text.primary} />
      </TouchableOpacity>
      <View style={styles.locationContainer}>
        <Ionicons name="location-sharp" size={20} color={COLORS.primary} />
        <Text style={styles.locationText}>आगरा, उत्तर प्रदेश</Text>
      </View>
      <TouchableOpacity style={styles.iconButton}>
        <View style={styles.notificationContainer}>
          <Ionicons name="notifications" size={24} color={COLORS.text.primary} />
          <View style={styles.notificationBadge} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundDarker,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  locationText: {
    marginLeft: SPACING.xs,
    ...FONTS.medium,
    color: COLORS.text.primary,
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
}); 