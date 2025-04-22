import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { COLORS, SPACING, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - (SPACING.md * 2);
const CARD_HEIGHT = 150; // Fixed height for consistency

export const ActionCard = ({ 
  title, 
  description, 
  buttonText, 
  icon,
  onPress,
  buttonWidth = '100%'
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.description} numberOfLines={2}>{description}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.button, { width: buttonWidth }]}
            onPress={onPress}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    padding: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center', // Center vertically
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#00A400',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Hind',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 26,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  description: {
    fontFamily: 'Hind',
    fontSize: 14,
    lineHeight: 18,
    color: '#666666',
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    backgroundColor: '#228917',
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Hind',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.white,
  },
}); 