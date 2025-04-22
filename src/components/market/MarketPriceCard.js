import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '../../constants/theme';

export const MarketPriceCard = ({ name, distance, price }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.distance}>{distance}</Text>
      <Text style={styles.price}>₹{price}</Text>
      <TouchableOpacity style={styles.routeButton}>
        <Ionicons name="navigate" size={16} color={COLORS.primary} />
        <Text style={styles.routeText}>मार्ग दिखाएं</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginLeft: SPACING.md,
    width: 160,
  },
  name: {
    ...FONTS.medium,
  },
  distance: {
    ...FONTS.regular,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  price: {
    ...FONTS.large,
    marginTop: SPACING.sm,
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  routeText: {
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    ...FONTS.regular,
  },
}); 