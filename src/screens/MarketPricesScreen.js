import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BaseScreen } from '../components/layout/BaseScreen';
import { MarketPriceCard } from '../components/market/MarketPriceCard';
import { MarketRateItem } from '../components/market/MarketRateItem';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { api } from '../services/api';

export const MarketPricesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [activeTab, setActiveTab] = useState('nearby'); // 'nearby' or 'rates'

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMarketPrices();
      setMarketData(data);
    } catch (err) {
      setError('बाज़ार भाव लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।');
      console.error('Error loading market data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>बाज़ार भाव लोड हो रहे हैं...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMarketData}>
            <Text style={styles.retryButtonText}>पुनः प्रयास करें</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        {activeTab === 'nearby' ? (
          <View style={styles.marketsGrid}>
            {marketData?.topMarkets.map(market => (
              <View key={market.id} style={styles.marketCardWrapper}>
                <MarketPriceCard
                  name={market.name}
                  distance={market.distance}
                  price={market.price}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.ratesList}>
            {marketData?.todayRates.map(rate => (
              <MarketRateItem
                key={rate.id}
                cropName={rate.cropName}
                priceRange={rate.priceRange}
              />
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <BaseScreen navigation={navigation}>
      <View style={styles.container}>
        <Text style={styles.title}>बाज़ार भाव</Text>
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'nearby' && styles.activeTab]}
            onPress={() => setActiveTab('nearby')}
          >
            <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTabText]}>
              नज़दीकी मंडियां
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'rates' && styles.activeTab]}
            onPress={() => setActiveTab('rates')}
          >
            <Text style={[styles.tabText, activeTab === 'rates' && styles.activeTabText]}>
              फसल भाव
            </Text>
          </TouchableOpacity>
        </View>
        {renderContent()}
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    ...FONTS.xlarge,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.xs,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.medium,
    color: COLORS.text.secondary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  marketsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  marketCardWrapper: {
    width: '48%', // Almost half width with gap
  },
  ratesList: {
    gap: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.text.primary,
    fontSize: 16,
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