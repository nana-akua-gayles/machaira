import React, { useState } from 'react';
import { View, StyleSheet, Pressable, FlatList, Image, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Heart, BookOpen } from 'lucide-react-native';
import { AppText } from '../../../../components/AppText';

// Updated Mock Data structured specifically as Written Machaira Episodes
const MOCK_TEXT_EPISODES = [
  { 
    id: '1', 
    title: 'Episode 42: The Sword of the Spirit', 
    series: 'Foundations of Faith', 
    progress: 75, 
    readTime: '8 min read',
    cover: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400' 
  },
  { 
    id: '2', 
    title: 'Episode 18: Walking in Righteousness', 
    series: 'Daily Devotional Series', 
    progress: 100, 
    readTime: '5 min read',
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400' 
  },
  { 
    id: '3', 
    title: 'Episode 55: Understanding Grace', 
    series: 'The Epistles Deep Dive', 
    progress: 20, 
    readTime: '12 min read',
    cover: 'https://images.unsplash.com/photo-1491841573168-733c8b1f3f88?w=400' 
  },
];

export const FavoriteBooksScreen = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState(MOCK_TEXT_EPISODES);

  const handleRemoveFavorite = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const renderEpisodeItem = ({ item }) => {
    const isCompleted = item.progress === 100;

    return (
      <View style={styles.episodeCard}>
        {/* Cover Art Wrapper */}
        <View style={styles.coverWrapper}>
          <Image source={{ uri: item.cover }} style={styles.episodeCover} />
          <View style={[styles.textBadge, isCompleted && styles.textBadgeCompleted]}>
            <BookOpen color="#ffffff" size={10} />
          </View>
        </View>
        
        <View style={styles.episodeDetails}>
          <View style={styles.titleRow}>
            <AppText type="bold" style={styles.episodeTitle} numberOfLines={1}>
              {item.title}
            </AppText>
            <Pressable 
              hitSlop={12} 
              onPress={() => handleRemoveFavorite(item.id)}
              style={styles.favoriteButton}
            >
              <Heart color="#ef4444" fill="#ef4444" size={16} />
            </Pressable>
          </View>
          
          <AppText type="regular" style={styles.seriesSubtitle}>
            {item.series} • {item.readTime}
          </AppText>

          {/* Red Theme Text Progress Tracker */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
            </View>
            <View style={styles.progressTextRow}>
              <AppText type="semiBold" style={[styles.progressText, isCompleted && styles.completedText]}>
                {isCompleted ? 'Finished Reading' : `${item.progress}% Read`}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Heart color="#fecaca" size={48} strokeWidth={1.5} fill="#fee2e2" />
      <AppText type="bold" style={styles.emptyTitle}>Shelf is Empty</AppText>
      <AppText type="regular" style={styles.emptySubtitle}>
        Tap the favorite icon while reading Machaira episodes to save them here.
      </AppText>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : insets.top }]}>
      {/* Header section with text nomenclature */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={16}>
          <ChevronLeft color="#09090b" size={24} strokeWidth={2.5} />
        </Pressable>
        <AppText type="bold" style={styles.headerTitle}>Favourite Studies</AppText>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderEpisodeItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 16, color: '#09090b', flex: 1, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerSpacer: { width: 40 },
  
  listContent: { padding: 20, gap: 14 },
  
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    ...Platform.select({
      ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8 },
      android: { elevation: 1 }
    })
  },
  coverWrapper: { position: 'relative' },
  episodeCover: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#cbd5e1'
  },
  textBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#a1a1aa', // Muted text indicator icon
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBadgeCompleted: {
    backgroundColor: '#ef4444' // Changes to theme color upon study completion
  },
  episodeDetails: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  episodeTitle: { fontSize: 14, color: '#09090b', flex: 1, marginRight: 8 },
  favoriteButton: { padding: 4 },
  seriesSubtitle: { fontSize: 12, color: '#71717a', marginTop: 2 },
  
  progressContainer: { marginTop: 10 },
  progressBarBackground: { height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#ef4444', borderRadius: 2 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  progressText: { fontSize: 11, color: '#64748b' },
  completedText: { color: '#ef4444' },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 140, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 16, color: '#09090b', marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: '#71717a', textAlign: 'center', marginTop: 6, lineHeight: 18 }
});