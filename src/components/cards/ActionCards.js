import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionCard } from './ActionCard';
import { COLORS, SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_SPACING = SPACING.lg;
const CARD_WIDTH = width * 0.9; // 90% of screen width

export const ActionCards = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));
    setActiveIndex(index);
  };

  const cards = [
    {
      title: "सभी मंडियों के भाव जानें",
      description: "AI से पाएं हर मंडी का लाइव रेट, बेचें सही दाम पर, बढ़ाएं मुनाफा",
      buttonText: "मंडी भाव पूछें →",
      icon: <MaterialIcons name="mic" size={40} color="white" />,
      buttonWidth: "100%",
      screenToNavigate: "VoiceAssistant"
    },
    {
      title: "मिट्टी की शक्ति जानें",
      description: "70% किसानों ने बढ़ाई उपज, जानें अपनी मिट्टी की सही क्षमता",
      buttonText: "मुफ्त जांच करें →",
      icon: <MaterialCommunityIcons name="sprout" size={40} color="white" />,
      buttonWidth: "100%",
      screenToNavigate: "SoilTest"
    }
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="center"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}
      >
        {cards.map((card, index) => (
          <View key={index} style={styles.cardWrapper}>
            <ActionCard
              {...card}
              navigation={navigation}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.paginationDots}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    paddingHorizontal: width * 0.05, // 5% padding on each side
    gap: CARD_SPACING,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    paddingVertical: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
  },
  activeDot: {
    backgroundColor: '#00A400',
  },
}); 