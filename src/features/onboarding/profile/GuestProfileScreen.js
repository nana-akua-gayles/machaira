import React, { useRef, useEffect, useCallback } from 'react';
import { 
  View, StyleSheet, ScrollView, Animated, Pressable, 
  StatusBar, Dimensions, AccessibilityInfo 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Shield, Sparkles, CloudLightning, BookOpen, Bookmark, 
  History, ChevronRight 
} from 'lucide-react-native';
import { AppText } from '../../../components/AppText';

const { width } = Dimensions.get('window');

const PREMIUM_FEATURES = [
  { Icon: CloudLightning, title: 'Cloud Synchronization', subtitle: 'Instantly mirror your data vaults across systems.' },
  { Icon: BookOpen, title: 'Advanced Analytics & Streaks', subtitle: 'Track deeply structured reading metrics over time.' },
  { Icon: Bookmark, title: 'Unlimited Verse Vaults', subtitle: 'Unlock unrestricted verse mapping categorizations.' },
  { Icon: History, title: 'Persistent Timeline Backups', subtitle: 'Recover deleted study sessions and revision histories.' },
];

// ==========================================
// 1. ATOMIC SUB-COMPONENTS
// ==========================================
// Moved outside of the main component to avoid recreation on every render cycle
const PremiumFeatureRow = ({ icon: Icon, title, subtitle }) => (
  <View style={styles.premiumFeatureRow}>
    <View style={styles.iconWrapper}>
      <Icon color="#ef4444" size={20} strokeWidth={2} />
    </View>
    <View style={styles.rowTextContainer}>
      <AppText type="semiBold" style={styles.rowTitle}>{title}</AppText>
      <AppText type="regular" style={styles.rowSubtitle}>{subtitle}</AppText>
    </View>
    <Shield color="rgba(239, 68, 68, 0.4)" size={16} />
  </View>
);

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export const GuestProfileScreen = ({ onUpgradePress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current = Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true })
    ]);
    
    animationRef.current.start();
    
    return () => {
      animationRef.current?.stop();
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.97);
    };
  }, [fadeAnim, scaleAnim]);

  const handleUpgradePress = useCallback(() => {
    if (typeof onUpgradePress === 'function') {
      onUpgradePress();
    } else {
      console.warn('GuestProfileScreen: onUpgradePress is not a function');
    }
  }, [onUpgradePress]);

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#352a48" />
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollLayout} 
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Tier Crown Header */}
          <Animated.View style={[
            styles.tierCard, 
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}>
            <View style={styles.tierHeaderRow}>
              <View style={styles.badgePill}>
                <Sparkles color="#ffffff" size={12} strokeWidth={2.5} />
                <AppText type="bold" style={styles.badgeText}>GUEST PASS</AppText>
              </View>
              <AppText type="black" style={styles.tierLabel}>TIER I</AppText>
            </View>
            <AppText type="black" style={styles.userName}>Guest Explorer</AppText>
            <AppText type="regular" style={styles.cardStatusText}>
              Offline Mode Active • Progress unsaved
            </AppText>
          </Animated.View>

          {/* Upsell Call to Action Card */}
          <Pressable 
            onPress={handleUpgradePress} 
            style={({ pressed }) => [styles.ctaCard, pressed && styles.pressedEffect]}
            accessibilityRole="button"
            accessibilityLabel="Upgrade to premium account"
            accessibilityHint="Double tap to create a permanent account and sync your data"
          >
            <View style={styles.ctaTextContent}>
              <AppText type="bold" style={styles.ctaTitle}>
                Secure Your Spiritual Archive
              </AppText>
              <AppText type="regular" style={styles.ctaSubtitle}>
                Create a permanent account to sync history, notes, and backup insights across devices safely.
              </AppText>
            </View>
            <View style={styles.ctaActionButton}>
              <ChevronRight color="#352a48" size={20} strokeWidth={3} />
            </View>
          </Pressable>

          {/* Locked High-Class Features List */}
          <View style={styles.sectionHeader}>
            <AppText type="bold" style={styles.sectionHeaderText}>
              PREMIUM ARCHIVE EXTENSIONS
            </AppText>
          </View>
          
          <View style={styles.featuresListBlock}>
            {PREMIUM_FEATURES.map((feature, index) => (
              <React.Fragment key={feature.title}>
                <PremiumFeatureRow
                  icon={feature.Icon}
                  title={feature.title}
                  subtitle={feature.subtitle}
                />
                {index < PREMIUM_FEATURES.length - 1 && (
                  <View style={styles.dividerLine} />
                )}
              </React.Fragment>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ==========================================
// 3. STYLES
// ==========================================
const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: '#352a48' },
  safeContainer: { flex: 1 },
  scrollLayout: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  tierCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.04)', 
    borderRadius: 24, 
    padding: 24, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.08)', 
    marginBottom: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 15, 
    elevation: 8 
  },
  tierHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 28 
  },
  badgePill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ef4444', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12, 
    gap: 4 
  },
  badgeText: { color: '#ffffff', fontSize: 10, letterSpacing: 0.5 },
  tierLabel: { color: 'rgba(255, 255, 255, 0.25)', fontSize: 14, letterSpacing: 1 },
  userName: { color: '#ffffff', fontSize: 28, letterSpacing: -0.5, marginBottom: 6 },
  cardStatusText: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 13 },
  ctaCard: { 
    backgroundColor: '#ffffff', 
    borderRadius: 20, 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 32, 
    shadowColor: '#ef4444', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 12, 
    elevation: 6 
  },
  ctaTextContent: { flex: 1, paddingRight: 12 },
  ctaTitle: { color: '#352a48', fontSize: 16, marginBottom: 4 },
  ctaSubtitle: { color: 'rgba(53, 42, 72, 0.7)', fontSize: 13, lineHeight: 18 },
  ctaActionButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(53, 42, 72, 0.06)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  pressedEffect: { opacity: 0.9 },
  sectionHeader: { marginBottom: 12, paddingLeft: 4 },
  sectionHeaderText: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 11, letterSpacing: 1.5 },
  featuresListBlock: { 
    backgroundColor: 'rgba(255, 255, 255, 0.02)', 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.04)', 
    paddingHorizontal: 16 
  },
  premiumFeatureRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 18 
  },
  iconWrapper: { 
    width: 36, 
    height: 36, 
    borderRadius: 12, 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  rowTextContainer: { flex: 1 },
  rowTitle: { color: '#ffffff', fontSize: 14, marginBottom: 2 },
  rowSubtitle: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 12 },
  dividerLine: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }
});