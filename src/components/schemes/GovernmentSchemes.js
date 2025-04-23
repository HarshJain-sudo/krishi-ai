import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');
const SPACING = 16;
const CARD_WIDTH = width - (SPACING * 2);

// Fallback data if no props are provided
const defaultSchemes = [
  {
    id: 1,
    title: 'प्रधानमंत्री फसल बीमा योजना',
    image_link: 'https://agricoop.gov.in/sites/default/files/PMFBY%20Logo%20English.jpg',
    redirect_link: 'https://pmfby.gov.in'
  },
  {
    id: 2,
    title: 'किसान मानधन योजना',
    image_link: 'https://static.pib.gov.in/WriteReadData/userfiles/image/image001UNEV.jpg',
    redirect_link: 'https://pmkmy.gov.in'
  },
  {
    id: 3,
    title: 'नमो ड्रोन योजना',
    image_link: 'https://static.pib.gov.in/WriteReadData/userfiles/image/Nano_Drone.jpeg',
    redirect_link: 'https://namodrone.gov.in'
  }
];

export const GovernmentSchemes = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = new Animated.Value(0);
  
  // Use provided data or fallback to default
  const schemes = data || defaultSchemes;

  const handleSchemePress = (link) => {
    Linking.openURL(link).catch((err) => console.error('Could not open URL:', err));
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {schemes.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { opacity: currentIndex === index ? 1 : 0.5 }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
          setCurrentIndex(newIndex);
        }}
        style={styles.scrollView}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING}
      >
        {schemes.map((scheme, index) => (
          <TouchableOpacity
            key={scheme.id}
            style={styles.schemeCard}
            onPress={() => handleSchemePress(scheme.redirect_link)}
            activeOpacity={0.95}
          >
            <Image
              source={typeof scheme.image_link === 'string' ? { uri: scheme.image_link } : scheme.image_link}
              style={styles.schemeImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollViewContent: {
    paddingHorizontal: SPACING,
  },
  schemeCard: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 16,
    marginRight: SPACING,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  schemeImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginHorizontal: 4,
  },
});