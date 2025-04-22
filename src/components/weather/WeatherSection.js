import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const WeatherSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View>
          <Text style={styles.greeting}>सुप्रभात, राजेश!</Text>
          <Text style={styles.date}>18 अप्रैल, 2025 | शुक्रवार</Text>
        </View>
        <View style={styles.weatherContainer}>
          <View style={styles.weatherIconContainer}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={32} color="#FFB300" />
          </View>
          <Text style={styles.temperature}>32°C</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    ...FONTS.xlarge,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  date: {
    ...FONTS.regular,
    color: COLORS.text.secondary,
  },
  weatherContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    borderRadius: 16,
    flexDirection: 'row',
    gap: SPACING.xs,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  weatherIconContainer: {
    marginRight: SPACING.xs,
  },
  temperature: {
    ...FONTS.large,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
}); 