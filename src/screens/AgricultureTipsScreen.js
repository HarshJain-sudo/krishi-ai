import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BaseScreen } from '../components/layout/BaseScreen';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { api } from '../services/api';

export const AgricultureTipsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAgricultureTips();
      setTips(data.tips || []);
    } catch (err) {
      setError('कृषि टिप्स लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।');
      console.error('Error loading tips:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTip = ({ item }) => (
    <View style={styles.tipCard}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.tipImage}
        resizeMode="cover"
      />
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{item.title}</Text>
        <Text style={styles.tipDescription}>{item.content}</Text>
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>कृषि टिप्स लोड हो रही हैं...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTips}>
            <Text style={styles.retryButtonText}>पुनः प्रयास करें</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (tips.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>कोई कृषि टिप्स उपलब्ध नहीं हैं</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={tips}
        renderItem={renderTip}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <BaseScreen navigation={navigation}>
      <View style={styles.container}>
        <Text style={styles.title}>कृषि टिप्स और सलाह</Text>
        <Text style={styles.subtitle}>फसल की देखभाल के लिए उपयोगी जानकारी</Text>
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
  },
  subtitle: {
    ...FONTS.regular,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  listContent: {
    paddingBottom: SPACING.md,
  },
  tipCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipImage: {
    width: '100%',
    height: 180,
  },
  tipContent: {
    padding: SPACING.md,
  },
  tipTitle: {
    ...FONTS.large,
    marginBottom: SPACING.xs,
  },
  tipDescription: {
    ...FONTS.regular,
    color: COLORS.text.secondary,
    lineHeight: 22,
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