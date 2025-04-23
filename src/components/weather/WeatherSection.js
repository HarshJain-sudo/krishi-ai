import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const WeatherSection = ({ data }) => {
  // Default values if no data is provided
  const temperature = data?.temp || 32;
  const condition = data?.condition || 'partly-cloudy';
  const date = data?.date || '18 अप्रैल, 2025';
  const day = data?.day || 'शुक्रवार';
  
  // Select the appropriate weather icon based on condition
  const getWeatherIcon = () => {
    switch(condition) {
      case 'sunny':
        return <MaterialCommunityIcons name="weather-sunny" size={32} color="#FFB300" />;
      case 'partly-cloudy':
        return <MaterialCommunityIcons name="weather-partly-cloudy" size={32} color="#FFB300" />;
      case 'cloudy':
        return <MaterialCommunityIcons name="weather-cloudy" size={32} color="#666" />;
      case 'rainy':
        return <MaterialCommunityIcons name="weather-rainy" size={32} color="#4476FF" />;
      default:
        return <MaterialCommunityIcons name="weather-partly-cloudy" size={32} color="#FFB300" />;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View>
          <Text style={styles.greeting}>सुप्रभात, राजेश!</Text>
          <Text style={styles.date}>{date} | {day}</Text>
        </View>
        <View style={styles.weatherContainer}>
          <View style={styles.weatherIconContainer}>
            {getWeatherIcon()}
          </View>
          <Text style={styles.temperature}>{temperature}°C</Text>
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