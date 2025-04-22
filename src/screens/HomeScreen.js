import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WeatherForecast } from '../components/weather/WeatherForecast';
import { AgricultureTips } from '../components/agriculture/AgricultureTips';
import { WeatherSection } from '../components/weather/WeatherSection';
import { ActionCards } from '../components/cards/ActionCards';
import { MarketPriceCard } from '../components/market/MarketPriceCard';
import { MarketRateItem } from '../components/market/MarketRateItem';
import { SectionHeader } from '../components/layout/SectionHeader';
import { GovernmentSchemes } from '../components/schemes/GovernmentSchemes';
import { FarmerTestimonials } from '../components/testimonials/FarmerTestimonials';
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
  const [activeTab, setActiveTab] = useState('home');

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.backgroundDarker, COLORS.background]}
        style={styles.gradient}
      >
        <View style={styles.mainContainer}>
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

            <WeatherForecast />
            <AgricultureTips />

            <SectionHeader 
              title="सरकारी योजना अपडेट"
              onSeeAll={() => {}}
            />
            <GovernmentSchemes />
            
            <SectionHeader 
              title="हमारे किसानों का अनुभव"
              onSeeAll={() => {}}
            />
            <FarmerTestimonials />
          </ScrollView>
          <Footer activeTab={activeTab} onTabPress={handleTabPress} />
        </View>
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
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  content: {
    flex: 1,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
}); 