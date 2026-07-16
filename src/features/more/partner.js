import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView, Pressable, StatusBar, Dimensions, Animated } from 'react-native';
import { AppText } from '../../components/AppText';
import { Handshake, Sparkles, Wheat, Star } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Color Palette - Red Theme
const DARK_BG = '#ffffff';
const RED_ACCENT = '#B91C1C';
const DEEP_PURPLE = '#352a48';
const TEXT_SUB = '#94a3b8';

const SCRIPTURE_PASSAGES = [
  {
    ref: "Philippians 1:3-5",
    text: "I thank my God every time I remember you... because of your partnership in the gospel from the first day until now."
  },
];

const HeaderWave = () => (
  <Svg height="150" width={width} viewBox="0 0 1440 320" style={styles.wave}>
    <Path
      fill={DEEP_PURPLE}
      d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,122.7C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
    />
  </Svg>
);

const ScripturalQuote = ({ passage, style }) => (
  <View style={[styles.quoteBlock, style]}>
    <Star color={RED_ACCENT} size={16} style={styles.quoteStar} />
    <AppText style={styles.quoteText}>{passage.text}</AppText>
    <AppText type="medium" style={styles.quoteRef}>~ {passage.ref}</AppText>
  </View>
);

export const PartnerScreen = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <HeaderWave />
      
      {/* Fixed Header Section (Stays at the top) */}
      <View style={styles.heroSection}>
        <View style={styles.iconOuterRing}>
          <Handshake color={DEEP_PURPLE} size={48} strokeWidth={1.5} />
        </View>
        <AppText type="bold" style={styles.mainTitle}>Partner with us</AppText>
      </View>

      {/* Scrolling Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.devotionalBox}>
          <AppText type="bold" style={styles.devotionalTitle}>The Mystery of Partnership</AppText>
          <AppText style={styles.devotionalText}>
            Partnership is not merely a transaction, but a joining of faith. 
            As the Apostle Paul wrote to the Philippians, you become partakers of the grace given to this house. 
            When you support the proclamation of the uncompromised Word, you share in the spiritual reward of every life transformed, every yoke broken, and every soul anchored in Truth.
          </AppText>
          <Sparkles color={RED_ACCENT} size={24} style={styles.devotionalIcon} />
        </View>

        <View style={styles.ctaSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable 
              style={styles.altarButton}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => {}}
            >
              <AppText type="bold" style={styles.altarButtonText}>Partner Today</AppText>
            </Pressable>
          </Animated.View>
          <AppText style={styles.disclaimer}>Your partnership supports the ongoing work of the Machaira with Apostle Bennie worldwide.</AppText>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: DARK_BG },
  wave: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0 },
  
  heroSection: { 
    alignItems: 'center', 
    paddingTop: 60, 
    paddingBottom: 20,
    zIndex: 2 
  },
  iconOuterRing: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    borderWidth: 2, borderColor: RED_ACCENT,
    shadowColor: RED_ACCENT, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  mainTitle: { fontSize: 30, color: DEEP_PURPLE, letterSpacing: 1, marginBottom: 8 },

  scrollContent: { paddingTop: 10, paddingBottom: 40 },
  
  devotionalBox: { 
    backgroundColor: DEEP_PURPLE, marginHorizontal: 20, padding: 30, borderRadius: 16, marginBottom: 50,
    borderWidth: 1, borderColor: RED_ACCENT,
    shadowColor: RED_ACCENT, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 
  },
  devotionalTitle: { fontSize: 22, color: RED_ACCENT, marginBottom: 16, textAlign: 'center' },
  devotionalText: { fontSize: 16, color: '#ffffff', lineHeight: 28, textAlign: 'center', fontStyle: 'italic', marginBottom: 20 },
  devotionalIcon: { alignSelf: 'center', color: RED_ACCENT },

  ctaSection: { alignItems: 'center', paddingHorizontal: 30, marginBottom: 50 },
  ctaPretext: { color: DEEP_PURPLE, marginBottom: 10, fontSize: 14 },
  altarButton: { 
    flexDirection: 'row', backgroundColor: RED_ACCENT, paddingVertical: 20, paddingHorizontal: 40, borderRadius: 40, 
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#7f1d1d',
    shadowColor: RED_ACCENT, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10, marginBottom: 20
  },
  altarButtonText: { color: '#ffffff', fontSize: 18, marginLeft: 12, letterSpacing: 0.5 },
  disclaimer: { color: TEXT_SUB, fontSize: 12, textAlign: 'center', lineHeight: 18 },

  sectionHeader: { fontSize: 16, color: DEEP_PURPLE, textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 20, marginBottom: 15 },
  quoteScroll: { paddingLeft: 20, marginBottom: 50 },
  quoteBlock: { 
    width: width - 60, height: 200, backgroundColor: '#ffffff', marginRight: 20, borderRadius: 16, padding: 25, 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: RED_ACCENT,
    shadowColor: DEEP_PURPLE, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4
  },
  quoteStar: { position: 'absolute', top: 15, right: 15, color: RED_ACCENT },
  quoteText: { fontSize: 17, color: DEEP_PURPLE, textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: 15 },
  quoteRef: { fontSize: 14, color: DEEP_PURPLE, fontWeight: '700' }
});