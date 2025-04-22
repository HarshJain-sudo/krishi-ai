import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/layout/Header';
import { WeatherSection } from '../components/weather/WeatherSection';
import { ActionCards } from '../components/cards/ActionCards';
import { MarketPriceCard } from '../components/market/MarketPriceCard';
import { MarketRateItem } from '../components/market/MarketRateItem';
import { SectionHeader } from '../components/layout/SectionHeader';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const marketPrices = [
  { id: 1, name: 'बारानी मंडी', distance: '15 किमी दूर', price: '2,580' },
  { id: 2, name: 'बारानी मंडी', distance: '15 किमी दूर', price: '2,580' },
];

const marketRates = [
  { id: 1, cropName: 'गेहूं', priceRange: '₹2,580 - ₹2,750' },
  { id: 2, cropName: 'गेहूं', priceRange: '₹2,580 - ₹2,750' },
  { id: 3, cropName: 'गेहूं', priceRange: '₹2,580 - ₹2,750' },
];

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.backgroundDarker, COLORS.background]}
        style={styles.gradient}
      >
        <Header />
        <ScrollView style={styles.content}>
          <WeatherSection />
          <ActionCards />
          
          <SectionHeader 
            title="सर्वाधिक मंडी किमतें"
            onSeeAll={() => {}}
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {marketPrices.map(item => (
              <MarketPriceCard
                key={item.id}
                name={item.name}
                distance={item.distance}
                price={item.price}
              />
            ))}
          </ScrollView>

          <SectionHeader 
            title="आज के बाज़ार के भाव"
            onSeeAll={() => {}}
          />
          {marketRates.map(item => (
            <MarketRateItem
              key={item.id}
              cropName={item.cropName}
              priceRange={item.priceRange}
            />
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
}); 