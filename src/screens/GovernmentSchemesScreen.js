import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { BaseScreen } from '../components/layout/BaseScreen';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { api } from '../services/api';

export const GovernmentSchemesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getGovernmentSchemes();
      setSchemes(data.items || []);
    } catch (err) {
      setError('योजनाएँ लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।');
      console.error('Error loading schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchemePress = (link) => {
    Linking.openURL(link).catch((err) => console.error('Could not open URL:', err));
  };

  const renderScheme = ({ item }) => (
    <TouchableOpacity 
      style={styles.schemeCard}
      onPress={() => handleSchemePress(item.redirect_link)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image_link }} 
        style={styles.schemeImage}
        resizeMode="cover"
      />
      <View style={styles.schemeContent}>
        <Text style={styles.schemeTitle}>{item.title}</Text>
        <Text style={styles.schemeLink}>विवरण देखें →</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>योजनाएँ लोड हो रही हैं...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSchemes}>
            <Text style={styles.retryButtonText}>पुनः प्रयास करें</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (schemes.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>कोई योजना उपलब्ध नहीं है</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={schemes}
        renderItem={renderScheme}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <BaseScreen navigation={navigation}>
      <View style={styles.container}>
        <Text style={styles.title}>सरकारी योजनाएँ</Text>
        <Text style={styles.subtitle}>किसानों के लिए लाभकारी सरकारी योजनाओं की जानकारी</Text>
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
  schemeCard: {
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
  schemeImage: {
    width: '100%',
    height: 160,
  },
  schemeContent: {
    padding: SPACING.md,
  },
  schemeTitle: {
    ...FONTS.large,
    marginBottom: SPACING.xs,
  },
  schemeLink: {
    color: COLORS.primary,
    ...FONTS.medium,
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