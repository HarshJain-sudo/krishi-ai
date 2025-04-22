import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '../../constants/theme';

export const MarketRateItem = ({ cropName, priceRange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.cropInfo}>
        <MaterialIcons name="grass" size={24} color={COLORS.secondary} />
        <Text style={styles.cropName}>{cropName}</Text>
      </View>
      <Text style={styles.priceRange}>{priceRange}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: 1,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropName: {
    marginLeft: SPACING.md,
    ...FONTS.medium,
  },
  priceRange: {
    ...FONTS.medium,
    color: COLORS.primary,
  },
}); 