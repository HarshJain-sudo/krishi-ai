import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BaseScreen } from '../components/layout/BaseScreen';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { api } from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';

export const FarmerTestimonialsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getFarmerTestimonials();
      setTestimonials(data.items || []);
    } catch (err) {
      setError('किसानों के अनुभव लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।');
      console.error('Error loading testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTestimonial = ({ item }) => (
    <View style={styles.testimonialCard}>
      <View style={styles.header}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.profileImage}
        />
        <View style={styles.farmerInfo}>
          <Text style={styles.farmerName}>{item.name}</Text>
          <Text style={styles.farmerVillage}>{item.village}</Text>
        </View>
      </View>
      <View style={styles.quoteContainer}>
        <MaterialIcons name="format-quote" size={24} color={COLORS.primary} style={styles.quoteIcon} />
        <Text style={styles.testimonialText}>"{item.content}"</Text>
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>किसानों के अनुभव लोड हो रहे हैं...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTestimonials}>
            <Text style={styles.retryButtonText}>पुनः प्रयास करें</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (testimonials.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>कोई किसान अनुभव उपलब्ध नहीं है</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={testimonials}
        renderItem={renderTestimonial}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <BaseScreen navigation={navigation}>
      <View style={styles.container}>
        <Text style={styles.title}>हमारे किसानों का अनुभव</Text>
        <Text style={styles.subtitle}>किसानों द्वारा कृषि ऐप के उपयोग से हुए लाभ और परिणाम</Text>
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
  testimonialCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SPACING.md,
  },
  farmerInfo: {
    flex: 1,
  },
  farmerName: {
    ...FONTS.large,
    fontSize: 18,
  },
  farmerVillage: {
    ...FONTS.regular,
    color: COLORS.text.secondary,
  },
  quoteContainer: {
    position: 'relative',
    paddingHorizontal: SPACING.md,
  },
  quoteIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
  },
  testimonialText: {
    ...FONTS.medium,
    paddingLeft: SPACING.sm,
    lineHeight: 24,
    fontStyle: 'italic',
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