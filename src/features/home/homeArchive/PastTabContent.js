import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import { Flame, ArrowUpRight } from 'lucide-react-native';

import { PAST_EPISODES } from './pastMachairaData';
import { AppText } from '../../../components/AppText'; 

export const PastTabContent = () => {
  const leftColumnItems = useMemo(() => PAST_EPISODES.filter((_, i) => i % 2 === 0), []);
  const rightColumnItems = useMemo(() => PAST_EPISODES.filter((_, i) => i % 2 !== 0), []);

  const renderCard = (item) => (
    <Pressable key={item.id} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.isolatedImageContainer}>
        <Image source={item.image} style={styles.pureCardImage} />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardMetaRow}>
          <AppText type="bold" style={styles.episodeNumber}>{item.episode}</AppText>
        </View>
        
        <AppText type="bold" style={styles.archiveCardTitle} numberOfLines={2}>
          {item.title}
        </AppText>
        
        <View style={styles.cardFooter}>
          <AppText type="semiBold" style={styles.cardDateText}>{item.date}</AppText>
          <View style={styles.actionIconCircle}>
            <ArrowUpRight color="#ef4444" size={12} strokeWidth={2.5} />
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.pastContainer}>
      <View style={styles.streakBanner}>
        <View style={styles.streakLeft}>
          <View style={styles.flameCircle}>
            <Flame color="#ef4444" size={18} fill="#ef4444" />
          </View>
          <View>
            <AppText type="bold" style={styles.streakTitle}>7-Day Devotional Streak</AppText>
            <AppText type="regular" style={styles.streakSubtitle}>You're on fire! Keep feeding your spirit.</AppText>
          </View>
        </View>
        <View style={styles.streakCountBadge}>
          <AppText type="bold" style={styles.streakCountText}>🔥 7</AppText>
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
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2, 
    shadowColor: '#0f172a', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 6 
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flameCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center' },
  streakTitle: { color: '#0f172a', fontSize: 13 },
  streakSubtitle: { color: '#64748b', fontSize: 11, marginTop: 1 },
  streakCountBadge: { backgroundColor: '#fef2f2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  streakCountText: { color: '#ef4444', fontSize: 13 },
    masonryGrid: { flexDirection: 'row', width: '100%', gap: 12 },
  gridColumn: { flex: 1, flexDirection: 'column', gap: 12 },
  card: { flex: 1, backgroundColor: '#ffffff', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9', elevation: 2, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8 },
  cardPressed: { transform: [{ scale: 0.98 }], opacity: 0.95 },
  isolatedImageContainer: { 
    width: '100%', 
    aspectRatio: 1.75,
    backgroundColor: '#f1f5f9', 
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderColor: '#f8fafc' 
  },
  pureCardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardContent: { padding: 12, flex: 1, justifyContent: 'space-between' },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  episodeNumber: { fontSize: 10, color: '#ef4444' },
  archiveCardTitle: { fontSize: 13, color: '#0f172a', lineHeight: 18, marginBottom: 8, minHeight: 36 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f8fafc', paddingTop: 8, marginTop: 'auto' },
  cardDateText: { fontSize: 11, color: '#94a3b8' },
  actionIconCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center' },
});