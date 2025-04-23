import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
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
import { COLORS, SPACING } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '../services/api';

export const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getHomeScreenData();
      setHomeData(data);
    } catch (err) {
      setError('डेटा लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।');
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSeeAll = (screenName) => {
    if (screenName) {
      navigation.navigate(screenName);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={[COLORS.backgroundDarker, COLORS.background]}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>लोड हो रहा है...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient
          colors={[COLORS.backgroundDarker, COLORS.background]}
          style={styles.gradient}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadHomeData}>
              <Text style={styles.retryButtonText}>पुनः प्रयास करें</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.backgroundDarker, COLORS.background]}
        style={styles.gradient}
      >
        <View style={styles.mainContainer}>
          <Header />
          <ScrollView style={styles.content}>
            <WeatherSection data={homeData?.weather?.current} />
            <ActionCards navigation={navigation} />
            
            <SectionHeader 
              title="सर्वाधिक मंडी किमतें"
              onSeeAll={() => handleSeeAll(homeData?.marketPrices?.seeAllScreen)}
            />

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {homeData?.marketPrices?.topMarkets.map(item => (
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
              onSeeAll={() => handleSeeAll(homeData?.marketPrices?.seeAllScreen)}
            />
            {homeData?.marketPrices?.todayRates.map(item => (
              <MarketRateItem
                key={item.id}
                cropName={item.cropName}
                priceRange={item.priceRange}
              />
            ))}

            <WeatherForecast data={homeData?.weather} />
            <AgricultureTips 
              data={homeData?.agricultureTips?.tips}
              onSeeAll={() => handleSeeAll(homeData?.agricultureTips?.seeAllScreen)}
            />

            <SectionHeader 
              title="सरकारी योजना अपडेट"
              onSeeAll={() => handleSeeAll(homeData?.schemes?.seeAllScreen)}
            />
            <GovernmentSchemes data={homeData?.schemes?.items} />
            
            <SectionHeader 
              title="हमारे किसानों का अनुभव"
              onSeeAll={() => handleSeeAll(homeData?.testimonials?.seeAllScreen)}
            />
            <FarmerTestimonials data={homeData?.testimonials?.items} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.text.primary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.text.primary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 