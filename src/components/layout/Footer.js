import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const Footer = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', icon: 'home-outline', label: 'होम' },
    { id: 'mandi', icon: 'business-outline', label: 'मंडी' },
    { id: 'weather', icon: 'cloud-outline', label: 'मौसम' },
    { id: 'news', icon: 'newspaper-outline', label: 'न्यूज़' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabPress(tab.id)}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={activeTab === tab.id ? COLORS.primary : '#666'}
          />
          <Text
            style={[
              styles.label,
              { color: activeTab === tab.id ? COLORS.primary : '#666' },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
}); 