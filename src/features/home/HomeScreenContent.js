import React, { useState, useMemo, useCallback } from 'react';
import { View, Pressable, ScrollView, StyleSheet, Image, Platform } from 'react-native';
import { BookOpen, Search, History, Layers, Bookmark, Play, Bell, Calendar, BookText, User } from 'lucide-react-native';

import { AppText } from '../../components/AppText'; 
import mp1 from '../../../assets/images/mp1.jpg';
import { PastTabContent } from './homeArchive/PastTabContent';
import { ProfileModalSheet } from '../onboarding/profile/ProfileDashboardContent'; 

const TABS = ['Past', 'Related', 'Saved', 'Search'];

// ==========================================
// 1. ATOMIC SUB-COMPONENTS
// ==========================================
const TabBarButton = React.memo(({ tab, isActive, onPress }) => {
  const size = 14;
  const color = isActive ? '#ef4444' : '#64748b';

  const tabIcon = useMemo(() => {
    switch (tab) {
      case 'Past': return <History color={color} size={size} strokeWidth={2.5} />;
      case 'Related': return <Layers color={color} size={size} strokeWidth={2.5} />;
      case 'Saved': return <Bookmark color={color} size={size} strokeWidth={2.5} />;
      case 'Search': return <Search color={color} size={size} strokeWidth={2.5} />;
      default: return null;
    }
  }, [tab, color]);

  return (
    <Pressable 
      onPress={onPress} 
      style={[styles.tabItemButton, isActive ? styles.tabActive : styles.tabInactive]}
    >
      <View style={styles.rowCenter}>
        {tabIcon}
        <AppText type="bold" style={[styles.tabLabelText, isActive && styles.tabLabelActive]}>
          {tab}
        </AppText>
      </View>
    </Pressable>
  );
});

const FallbackTabContent = React.memo(({ tabName }) => (
  <View style={styles.fallbackContainer}>
    <BookOpen color="#ef4444" size={24} />
    <AppText type="semiBold" style={styles.fallbackText}>
      {tabName} feed coming soon...
    </AppText>
  </View>
));

// ==========================================
// 2. MAIN CORE COMPONENT
// ==========================================
export default function MachairaHome({ 
  user, 
  navigation, 
  onNavigateToSupport, 
  profileVisible, 
  setProfileVisible,
  onNavigateToMenuOption,
  onLogout // <-- 1. ADDED THIS PROP ACCEPTER
}) {
  const [activeTab, setActiveTab] = useState('Past');

  const isGuest = !user;
  const userDisplayName = user?.name || 'Guest';
  const userAvatarUrl = user?.photo;

  const handleProfilePress = useCallback(() => setProfileVisible(true), [setProfileVisible]);
  const handleBibleNavigation = useCallback(() => navigation.navigate('Bible'), [navigation]);
  
  const handleSupportNavigation = useCallback(() => {
    if (onNavigateToSupport) {
      onNavigateToSupport();
    } else {
      navigation.navigate('Support'); 
    }
  }, [onNavigateToSupport, navigation]);

  return (
    <View style={styles.flexOne}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header Section */}
        <View style={styles.header}>
          <Pressable 
            style={styles.profileTarget} 
            onPress={handleProfilePress} 
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {userAvatarUrl ? (
              <Image source={{ uri: userAvatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <User color="#ea580c" size={18} strokeWidth={2.5} />
              </View>
            )}
            <View style={styles.flexOne}>
              <AppText type="regular" style={styles.greetingMicro}>
                {isGuest ? 'Welcome to Machaira' : 'Welcome back'}
              </AppText>
              <AppText type="bold" numberOfLines={1} style={styles.profileName}>
                {userDisplayName}
              </AppText>
            </View>
          </Pressable>
          <Pressable style={styles.subscribeBtn}>
            <Bell color="#475569" size={13} strokeWidth={2.5} style={styles.bellIconSpacing} />
            <AppText type="bold" style={styles.subscribeText}>Subscribe</AppText>
          </Pressable>
        </View>

        {/* Feature Hero Banner Segment */}
        <View style={styles.heroWrapper}>
          <Image source={mp1} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroPane}>
            <View style={styles.rowCenter}>
              <Calendar color="#475569" size={14} style={styles.calendarIconSpacing} />
              <AppText type="semiBold" style={styles.metaText}>Monday, August 29, 2023</AppText>
            </View>
            <AppText type="bold" style={styles.episodeText} numberOfLines={2}>
              Episode 217 – How to Experience the Workings of the Word
            </AppText>
            
            <View style={[styles.rowCenter, styles.actionRow]}>
              <Pressable style={styles.listenBtn}>
                <Play color="#1e293b" size={16} fill="#1e293b" style={styles.playIconSpacing} />
                <AppText type="semiBold" style={styles.listenText}>Listen Now</AppText>
              </Pressable>
              
              <Pressable style={styles.readBtn} onPress={handleBibleNavigation}>
                <BookText color="#fff" size={16} style={styles.bookIconSpacing} />
                <AppText type="semiBold" style={styles.readText}>Read Text</AppText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Section Divider Headers */}
        <View style={styles.sectionHeader}>
          <AppText type="bold" style={styles.sectionTitle}>Explore Archive</AppText>
          <View style={styles.sectionDivider} />
        </View>

        {/* Segment Filter Selection Menu */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TabBarButton
              key={tab}
              tab={tab}
              isActive={tab === activeTab}
              onPress={() => setActiveTab(tab)}
            />
          ))}
        </View>
        
        {activeTab === 'Past' ? (
          <PastTabContent />
        ) : (
          <FallbackTabContent tabName={activeTab} />
        )}
      </ScrollView>

      {/* Profile Modal Sheet Overlay */}
      <ProfileModalSheet 
        visible={profileVisible} 
        onClose={() => setProfileVisible(false)} 
        user={user} 
        onLogout={onLogout} // <-- 2. ROUTED THE PROP HERE
        onNavigateToSupport={handleSupportNavigation}
        onNavigateToMenuOption={onNavigateToMenuOption}
      />
    </View>
  );
}

// ==========================================
// 3. CLEAN STYLES MANAGEMENT
// ==========================================
const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: '#fafaf9' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  actionRow: { width: '100%' }, 
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16, 
    backgroundColor: '#fafaf9', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9', 
    marginBottom: 20 
  },
  profileTarget: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 16 },
  avatarImage: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#e2e8f0' },
  avatarFallback: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#ffedd5', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fed7aa' },
  greetingMicro: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 },
  profileName: { fontSize: 15, color: '#0f172a', marginTop: -1 },
  subscribeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  subscribeText: { color: '#475569', fontSize: 11, letterSpacing: 0.3 },
  heroWrapper: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginBottom: 28, 
    borderWidth: 1, 
    borderColor: '#f1f5f9', 
    ...Platform.select({ 
      ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 16 }, 
      android: { elevation: 4 } 
    }) 
  },
  heroImage: { width: '100%', height: 195, backgroundColor: '#e2e8f0' },
  heroPane: { padding: 20, alignItems: 'flex-start' },
  metaText: { fontSize: 13, color: '#475569' },
  episodeText: { fontSize: 18, color: '#0f172a', lineHeight: 24, marginBottom: 20 },
  listenBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#f1f5f9', paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  readBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  listenText: { color: '#1e293b', fontSize: 14 },
  readText: { color: '#ffffff', fontSize: 14 },
  sectionHeader: { marginTop: 22, marginBottom: 16, gap: 4 },
  sectionTitle: { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, paddingLeft: 2 },
  sectionDivider: { height: 1, backgroundColor: '#e2e8f0', width: '30%', marginLeft: 2, opacity: 0.7 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 20, paddingHorizontal: 4 },
  tabItemButton: { paddingVertical: 8, flex: 1, alignItems: 'center', borderBottomWidth: 2 },
  tabInactive: { backgroundColor: 'transparent', borderBottomColor: 'transparent' },
  tabActive: { backgroundColor: 'transparent', borderBottomColor: '#ef4444' },
  tabLabelText: { color: '#64748b', fontSize: 13, letterSpacing: -0.1, marginLeft: 5 }, 
  tabLabelActive: { color: '#0f172a' },
  fallbackContainer: { backgroundColor: '#ffffff', borderRadius: 16, padding: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f1f5f9', marginTop: 10 },
  fallbackText: { color: '#64748b', fontSize: 14, marginTop: 8 },
  
  bellIconSpacing: { marginRight: 5 },
  calendarIconSpacing: { marginRight: 6 },
  playIconSpacing: { marginRight: 8 },
  bookIconSpacing: { marginRight: 8 }
});