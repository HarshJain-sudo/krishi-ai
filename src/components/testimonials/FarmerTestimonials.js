import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Reduced width to 300px
const CARD_WIDTH = 300;
const SPACING = 16;
const GAP = 10;

const testimonials = [
  {
    id: 1,
    image_link: require('../../../assets/images/farmer1.png')
  },
  {
    id: 2,
    image_link: require('../../../assets/images/farmer2.png')
  },
  {
    id: 3,
    image_link: require('../../../assets/images/farmer3.png')
  }
];

export const FarmerTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = new Animated.Value(0);

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
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + GAP));
          setCurrentIndex(newIndex);
        }}
        style={styles.scrollView}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + GAP}
      >
        {testimonials.map((testimonial, index) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + GAP),
            index * (CARD_WIDTH + GAP),
            (index + 1) * (CARD_WIDTH + GAP),
          ];
          
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={testimonial.id}
              style={[
                styles.testimonialCard,
                { transform: [{ scale }] }
              ]}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={testimonial.image_link}
                  style={styles.testimonialImage}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.paginationContainer}>
        {testimonials.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { opacity: currentIndex === index ? 1 : 0.5 }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: SPACING,
    color: '#333333',
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollViewContent: {
    paddingHorizontal: SPACING,
    gap: GAP,
  },
  testimonialCard: {
    width: CARD_WIDTH,
    height: 137,
    borderRadius: 16,
    marginRight: GAP,
    backgroundColor: '#FFF',
    padding: SPACING,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testimonialImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: GAP,
    gap: GAP,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
}); 