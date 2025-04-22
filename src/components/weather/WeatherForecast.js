import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

const WeatherDay = ({ day, temp, icon, isWarning, humidity, wind }) => (
  <TouchableOpacity style={[styles.dayCard, isWarning && styles.warningCard]}>
    <Text style={styles.dayText}>{day}</Text>
    {icon === 'sunny' ? (
      <Ionicons name="sunny-outline" size={28} color="#FFB800" />
    ) : icon === 'partly-cloudy' ? (
      <Ionicons name="partly-sunny-outline" size={28} color="#666" />
    ) : (
      <Ionicons name="rainy-outline" size={28} color="#FF4D4F" />
    )}
    <Text style={styles.tempText}>{temp}°C</Text>
    <View style={styles.weatherDetails}>
      {/* <View style={styles.weatherDetail}>
        <Ionicons name="water-outline" size={14} color="#666" />
        <Text style={styles.detailText}>{humidity}%</Text>
      </View> */}
      {/* <View style={styles.weatherDetail}>
        <Ionicons name="leaf-outline" size={14} color="#666" />
        <Text style={styles.detailText}>{wind} km/h</Text>
      </View> */}
    </View>
  </TouchableOpacity>
);

const FarmingTip = ({ condition }) => (
  <View style={styles.farmingTip}>
    <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
    <Text style={styles.tipText}>
      {condition === 'sunny' 
        ? 'सिंचाई के लिए उपयुक्त समय: सुबह या शाम'
        : condition === 'partly-cloudy'
        ? 'फसल स्प्रे के लिए अनुकूल मौसम'
        : 'कृपया फसल को ढक कर रखें'}
    </Text>
  </View>
);

export const WeatherForecast = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>मौसम पूर्वानुमान</Text>
          <Text style={styles.subtitle}>कृषि कार्य के लिए मौसम जानकारी</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAll}>सभी देखें</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.forecastContainer}>
        <WeatherDay 
          day="आज" 
          temp="32" 
          icon="sunny" 
          humidity="45"
          wind="12"
        />
        <WeatherDay 
          day="शनि" 
          temp="31" 
          icon="partly-cloudy"
          humidity="52"
          wind="8"
        />
        <WeatherDay 
          day="रवि" 
          temp="28" 
          icon="rainy" 
          isWarning
          humidity="78"
          wind="15"
        />
      </View>

      <FarmingTip condition="sunny" />

      <View style={styles.warningBox}>
        <View style={styles.warningIcon}>
          <Ionicons name="warning-outline" size={20} color="#fff" />
        </View>
        <View style={styles.warningContent}>
          <Text style={styles.warningTitle}>फसल चेतावनी</Text>
          <Text style={styles.warningText}>रविवार को तेज बारिश की चेतावनी - फसल सुरक्षा के लिए तैयारी करें</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 4,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  warningCard: {
    backgroundColor: '#FFF1F0',
  },
  dayText: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  tempText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
  },
  weatherDetails: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  farmingTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    marginLeft: 8,
    color: '#0066CC',
    fontSize: 13,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    borderRadius: 8,
    padding: 12,
  },
  warningIcon: {
    backgroundColor: '#FF4D4F',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    color: '#FF4D4F',
    fontWeight: '600',
    marginBottom: 2,
  },
  warningText: {
    color: '#FF4D4F',
    fontSize: 13,
  },
}); 