import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import { Flame, ArrowUpRight } from 'lucide-react-native';

import { PAST_EPISODES } from './pastMachairaData';
import { AppText } from '../../../components/AppText'; 
import { useTheme } from '../../../context/ThemeContext';

export const PastTabContent = () => {
  const { colors, isDark } = useTheme();
  const softTint = isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2';

  const leftColumnItems = useMemo(() => PAST_EPISODES.filter((_, i) => i % 2 === 0), []);
  const rightColumnItems = useMemo(() => PAST_EPISODES.filter((_, i) => i % 2 !== 0), []);

  const renderCard = (item) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.isolatedImageContainer,
          { backgroundColor: colors.border, borderColor: colors.border },
        ]}
      >
        <Image source={item.image} style={styles.pureCardImage} />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardMetaRow}>
          <AppText type="bold" style={[styles.episodeNumber, { color: colors.primary }]}>
            {item.episode}
          </AppText>
        </View>
        
        <AppText
          type="bold"
          style={[styles.archiveCardTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.title}
        </AppText>
        
        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <AppText type="semiBold" style={[styles.cardDateText, { color: colors.textSecondary }]}>
            {item.date}
          </AppText>
          <View style={[styles.actionIconCircle, { backgroundColor: softTint }]}>
            <ArrowUpRight color={colors.primary} size={12} strokeWidth={2.5} />
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.pastContainer}>
      <View
        style={[
          styles.streakBanner,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.streakLeft}>
          <View style={[styles.flameCircle, { backgroundColor: softTint }]}>
            <Flame color={colors.primary} size={18} fill={colors.primary} />
          </View>
          <View>
            <AppText type="bold" style={[styles.streakTitle, { color: colors.text }]}>
              7-Day Devotional Streak
            </AppText>
            <AppText type="regular" style={[styles.streakSubtitle, { color: colors.textSecondary }]}>
              You're on fire! Keep feeding your spirit.
            </AppText>
          </View>
        </View>
        <View style={[styles.streakCountBadge, { backgroundColor: softTint }]}>
          <AppText type="bold" style={[styles.streakCountText, { color: colors.primary }]}>
            🔥 7
          </AppText>
        </View>
      </View>

      {/* Grid Layout Core Feed */}
      <View style={styles.masonryGrid}>
        <View style={styles.gridColumn}>
          {leftColumnItems.map((item) => renderCard(item))}
        </View>
        <View style={styles.gridColumn}>
          {rightColumnItems.map((item) => renderCard(item))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pastContainer: { width: '100%' },
  
  streakBanner: { 
    borderRadius: 16, 
    padding: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 20,
    borderWidth: 1,
    elevation: 2, 
    shadowColor: '#0f172a', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 6 
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flameCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  streakTitle: { fontSize: 13 },
  streakSubtitle: { fontSize: 11, marginTop: 1 },
  streakCountBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  streakCountText: { fontSize: 13 },
    masonryGrid: { flexDirection: 'row', width: '100%', gap: 12 },
  gridColumn: { flex: 1, flexDirection: 'column', gap: 12 },
  card: { flex: 1, borderRadius: 20, overflow: 'hidden', borderWidth: 1, elevation: 2, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8 },
  cardPressed: { transform: [{ scale: 0.98 }], opacity: 0.95 },
  isolatedImageContainer: { 
    width: '100%', 
    aspectRatio: 1.75,
    overflow: 'hidden',
    borderBottomWidth: 1,
  },
  pureCardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardContent: { padding: 12, flex: 1, justifyContent: 'space-between' },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  episodeNumber: { fontSize: 10 },
  archiveCardTitle: { fontSize: 13, lineHeight: 18, marginBottom: 8, minHeight: 36 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 8, marginTop: 'auto' },
  cardDateText: { fontSize: 11 },
  actionIconCircle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});