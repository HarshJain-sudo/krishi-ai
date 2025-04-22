import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // Full width minus padding

const TipCard = ({ icon, title, description, imageUrl, category }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = new Animated.Value(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.spring(animation, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const descriptionHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 100],
  });

  return (
    <TouchableOpacity 
      style={styles.tipCard}
      activeOpacity={0.97}
      onPress={toggleExpand}
    >
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.backgroundImage}
        blurRadius={2}
      />
      <View style={styles.gradientOverlay} />
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.categoryContainer}>
            <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(category) }]}>
              <Ionicons name={icon} size={20} color="#fff" />
            </View>
            <View style={[styles.categoryTag, { 
              backgroundColor: getCategoryColor(category) + '30',
              borderWidth: 1,
              borderColor: getCategoryColor(category) + '50',
            }]}>
              <Text style={[styles.categoryText, { 
                color: '#fff',
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }]}>
                {category}
              </Text>
            </View>
          </View>
          
          <View style={styles.engagementContainer}>
            <TouchableOpacity 
              style={[styles.engagementButton, styles.buttonBackground]}
              onPress={(e) => {
                e.stopPropagation();
                // Add bookmark functionality
              }}
            >
              <Ionicons name="bookmark-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.engagementButton, styles.buttonBackground]}
              onPress={(e) => {
                e.stopPropagation();
                // Add share functionality
              }}
            >
              <Ionicons name="share-social-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.tipTitle} numberOfLines={2}>
            {title}
          </Text>
          <Animated.View style={{ height: descriptionHeight }}>
            <Text style={styles.tipDescription} numberOfLines={expanded ? undefined : 2}>
              {description}
            </Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.readMoreButton, styles.buttonBackground]}
            onPress={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
          >
            <Text style={styles.readMoreText}>
              {expanded ? 'कम दिखाएं' : 'और पढ़ें'}
            </Text>
            <Ionicons 
              name={expanded ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color="#fff" 
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
          
          <View style={styles.statsContainer}>
            <View style={[styles.stat, styles.buttonBackground]}>
              <Ionicons name="eye-outline" size={16} color="#fff" />
              <Text style={styles.statText}>2.5K</Text>
            </View>
            <View style={[styles.stat, styles.buttonBackground]}>
              <Ionicons name="heart-outline" size={16} color="#fff" />
              <Text style={styles.statText}>128</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'सिंचाई': return '#4CAF50';
    case 'फसल': return '#FF9800';
    case 'सुरक्षा': return '#2196F3';
    default: return COLORS.primary;
  }
};

export const AgricultureTips = () => {
  const tips = [
    {
      icon: "water-outline",
      category: "सिंचाई",
      title: "गर्मी में सिंचाई प्रबंधन",
      description: "गर्मी के मौसम में फसलों की सिंचाई का विशेष ध्यान रखें। सुबह 6 बजे से 8 बजे के बीच या शाम 4 बजे से 6 बजे के बीच ही सिंचाई करें। मिट्टी की नमी की जांच 5-7 सेमी की गहराई तक करें। ड्रिप सिंचाई से 40-50% पानी की बचत होती है। खड़ी फसल में 3-4 दिन के अंतराल पर हल्की सिंचाई करें। क्यारियों में 2-3 इंच पानी ही दें। पौधों की जड़ों के पास मल्चिंग करें - इससे पानी का वाष्पीकरण कम होगा। सिंचाई के बाद खेत में जलभराव न होने दें। बूंद-बूंद सिंचाई के लिए 1-1.5 किलोग्राम प्रति वर्ग मीटर दबाव रखें। फसल की अवस्था के अनुसार सिंचाई का समय और मात्रा तय करें।",
      imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: "leaf-outline",
      category: "फसल",
      title: "गर्मियों के लिए उपयुक्त फसलें",
      description: "गर्मी के मौसम में मिर्ची, लौकी, तोरी, और अरहर जैसी फसलें उपयुक्त रहता है। इन फसलों की बुवाई का सही समय।",
      imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: "shield-outline",
      category: "सुरक्षा",
      title: "कीट नियंत्रण के प्राकृतिक तरीके",
      description: "नीम का तेल, लहसुन का रस, और हल्दी पाउडर का घोल कीटों से बचाव के लिए प्राकृतिक विकल्प है। जैविक कीटनाशक बनाने की विधि।",
      imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: "nutrition-outline",
      category: "पोषण",
      title: "जैविक खाद का प्रयोग",
      description: "फसलों की बेहतर पैदावार के लिए वर्मी कम्पोस्ट और गोबर की खाद का प्रयोग करें। मिट्टी की उर्वरता बढ़ाएं।",
      imageUrl: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: "sunny-outline",
      category: "मौसम",
      title: "गर्मी से फसल सुरक्षा",
      description: "तेज धूप से फसलों की सुरक्षा के लिए मल्चिंग का प्रयोग करें। छायादार फसलों का उपयोग करें।",
      imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>कृषि टिप्स</Text>
            <Text style={styles.subtitle}>आज के महत्वपूर्ण सुझाव</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAll}>सभी देखें</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {tips.map((tip, index) => (
          <TipCard key={index} {...tip} />
        ))}
      </View>

      {/* <View style={styles.section}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>सरकारी योजना अपडेट</Text>
            <Text style={styles.subtitle}>नवीनतम कृषि योजनाएं</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAll}>सभी देखें</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 4,
  },
  tipCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    height: 220,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.8) 100%)',
  },
  buttonBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 26,
  },
  tipDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    opacity: 0.95,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  readMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  engagementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagementButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
  },
}); 