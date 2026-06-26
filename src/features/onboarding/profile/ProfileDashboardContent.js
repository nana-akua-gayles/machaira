import React, { useMemo, useCallback } from 'react';
import { 
  View, StyleSheet, Pressable, ScrollView, Platform, 
  Image, Modal, Dimensions, Share, FlatList 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Flame, CloudSync, Gift, Globe, Notebook, User,
  MicVocal, FoldHands, Heart, MessageSquareWarning, 
  ChevronRight, LogOut, Trophy, Share2, Bell, UserCheck, 
  BookmarkCheck, X 
} from 'lucide-react-native';

import { AppText } from '../../../components/AppText';

const { height, width } = Dimensions.get('window');
const SCREEN_HEIGHT_BOTTOM_SHEET = height * 0.88;
const GRID_TILE_WIDTH = (width - 56) / 2;

// ==========================================
// 1. DATA CONFIGURATION & SCHEMA
// ==========================================
const MENU_SCHEMA = {
  engagement: {
    title: 'Engagement & Rewards',
    items: [
      { id: 'readers', label: 'Top Readers', icon: Trophy, color: '#ff3b30', bgColor: 'rgba(255, 59, 48, 0.08)' },
      { id: 'streaks', label: 'Daily Streaks', icon: Flame, color: '#ff3b30', bgColor: 'rgba(255, 59, 48, 0.08)' },
      { id: 'rewards', label: 'Rewards', icon: Gift, color: '#ff3b30', bgColor: 'rgba(255, 59, 48, 0.08)' },
      { id: 'nerds', label: 'Global Machaira Nerds', icon: Globe, color: '#ff3b30', bgColor: 'rgba(255, 59, 48, 0.08)' },
    ]
  },
  utilities: {
    title: 'Account Utilities',
    items: [
      { id: 'notes', label: 'My Notes', icon: Notebook, color: '#52525b', bgColor: 'rgba(244, 244, 245, 0.8)' },
      { id: 'testimony', label: 'Testimony', icon: MicVocal, color: '#52525b', bgColor: 'rgba(244, 244, 245, 0.8)' },
      { id: 'prayer', label: 'Prayer Request Logs', icon: FoldHands, color: '#52525b', bgColor: 'rgba(244, 244, 245, 0.8)', hideInModal: true },
      { id: 'books', label: 'Favourite Books', icon: Heart, color: '#52525b', bgColor: 'rgba(244, 244, 245, 0.8)', description: "9 unique titles" },
      { id: 'support', label: 'Support / Feedback', icon: MessageSquareWarning, color: '#52525b', bgColor: 'rgba(244, 244, 245, 0.8)' },
      { id: 'share', label: 'Share App', icon: Share2, color: '#52525b', bgColor: 'rgba(244, 244, 245, 0.8)' },
    ]
  }
};

// ==========================================
// 2. ATOMIC SUB-COMPONENTS
// ==========================================
const ProfileCard = ({ user }) => {
  const isGuest = !user;
  return (
    <View style={[styles.mainIdentityCard, isGuest ? styles.guestCardBg : styles.authCardBg]}>
      {user?.photo ? (
        <Image source={{ uri: user.photo }} style={styles.largeProfileAvatar} />
      ) : (
        <View style={[styles.largeFallbackAvatarCircle, isGuest ? styles.fallbackCircleGuest : styles.fallbackCircleAuth]}>
          <User color={isGuest ? '#ff3b30' : 'rgba(255,255,255,0.8)'} size={22} strokeWidth={2} />
        </View>
      )}
      <View style={styles.identityTextDetails}>
        {isGuest && <AppText type="bold" style={styles.guestWelcomeSubtitle}>MACHAIRA APP</AppText>}
        <AppText type="bold" style={isGuest ? styles.textDark : styles.textLight}>
          {isGuest ? 'Anonymous Mode' : user?.name}
        </AppText>
        <AppText type="regular" style={isGuest ? styles.subDark : styles.subLight}>
          {isGuest ? 'Sign in to back up your journey.' : user?.email}
        </AppText>
      </View>
      {!isGuest && (
        <View style={styles.verifiedFloatingPillBadge}>
          <AppText type="bold" style={styles.verifiedTextBadgeText}>SYNCED</AppText>
        </View>
      )}
    </View>
  );
};

const QuickActions = ({ onNavigate }) => (
  <View style={styles.subProfileActionsContainer}>
    <Pressable 
      style={({ pressed }) => [styles.inlineProfileButton, pressed && styles.rowPressedStyle]} 
      onPress={() => onNavigate('profile_details')}
    >
      <UserCheck color="#ff3b30" size={14} strokeWidth={2.2} />
      <AppText type="semiBold" style={styles.inlineProfileButtonText}>Profile Details</AppText>
    </Pressable>
    <Pressable 
      style={({ pressed }) => [styles.bellIconButton, pressed && styles.rowPressedStyle]} 
      onPress={() => onNavigate('notifications')}
    >
      <Bell color="#3f3f46" size={15} strokeWidth={2.2} />
    </Pressable>
  </View>
);

const BackupBanner = ({ visible, onPress }) => {
  if (!visible) return null;
  return (
    <Pressable style={({ pressed }) => [styles.cloudSyncBanner, pressed && styles.rowPressedStyle]} onPress={onPress}>
      <CloudSync color="#ff3b30" size={20} strokeWidth={2} />
      <View style={styles.cloudSyncTextStack}>
        <AppText type="bold" style={styles.cloudSyncHeadline}>Backup Account Data</AppText>
        <AppText type="regular" style={styles.cloudSyncDescription}>Link your profile details to secure your scripture study milestones safely.</AppText>
      </View>
      <ChevronRight color="#ff3b30" size={14} strokeWidth={2.5} />
    </Pressable>
  );
};

const MetricMatrix = () => (
  <View style={styles.engagementStatsMatrixRow}>
    <View style={styles.statItemSquare}>
      <Flame color="#ff3b30" size={18} strokeWidth={2.2} />
      <AppText type="bold" style={styles.statPrimaryValue}>12 Days</AppText>
      <AppText type="regular" style={styles.statSecondaryLabel}>Study Streak</AppText>
    </View>
    <View style={styles.verticalBorderDividerLine} />
    <View style={styles.statItemSquare}>
      <BookmarkCheck color="#ff9500" size={18} strokeWidth={2.2} />
      <AppText type="bold" style={styles.statPrimaryValue}>47 items</AppText>
      <AppText type="regular" style={styles.statSecondaryLabel}>Saved Verses</AppText>
    </View>
  </View>
);

const SectionHeader = ({ title }) => (
  <View style={styles.groupHeaderLabelWrapper}>
    <AppText type="bold" style={styles.groupSectionHeaderText}>{title}</AppText>
  </View>
);

const NavMenuOption = ({ icon: Icon, color, bgColor, label, description, onPress, style }) => (
  <Pressable style={({ pressed }) => [styles.menuItemRow, style, pressed && styles.rowPressedStyle]} onPress={onPress}>
    <View style={[styles.menuItemIconWrapper, { backgroundColor: bgColor }]}>
      <Icon color={color} size={18} strokeWidth={2.2} />
    </View>
    <View style={styles.menuItemTextStack}>
      <AppText type="semiBold" style={styles.menuItemTitleText}>{label}</AppText>
      {description && <AppText type="regular" style={styles.menuItemDescText}>{description}</AppText>}
    </View>
    <ChevronRight color={color === '#ff3b30' ? '#fca5a5' : '#d4d4d8'} size={15} strokeWidth={2.2} />
  </Pressable>
);

// ==========================================
// 3. MAIN COMPONENT 1: DASHBOARD CONTENT
// ==========================================
export const ProfileDashboardContent = ({ 
  user, onLogout, onTriggerLogin, onNavigateToSupport, onNavigateToMenuOption 
}) => {
  const insets = useSafeAreaInsets();
  const isGuest = !user;

  const handlePress = useCallback((id) => {
    if (id === 'logout') onLogout?.();
    else if (id === 'support') onNavigateToSupport?.();
    else onNavigateToMenuOption?.(id);
  }, [onLogout, onNavigateToSupport, onNavigateToMenuOption]);

  const listData = useMemo(() => {
    const sections = [MENU_SCHEMA.engagement, MENU_SCHEMA.utilities];
    return isGuest ? sections : [
      ...sections, 
      { title: '', items: [{ id: 'logout', label: 'Logout', icon: LogOut, color: '#ff3b30', bgColor: 'rgba(255, 59, 48, 0.1)' }] }
    ];
  }, [isGuest]);

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 60 }}
    >
      <ProfileCard user={user} />
      <QuickActions onNavigate={(target) => onNavigateToMenuOption?.(target)} />
      <BackupBanner visible={isGuest} onPress={onTriggerLogin} />
      <MetricMatrix />

      {listData.map((group, idx) => (
        <View key={group.title || `section-${idx}`} style={styles.groupSectionContainer}>
          {group.title ? <SectionHeader title={group.title} /> : <View style={{ marginTop: 12 }} />}
          <View style={styles.groupContentBoxStack}>
            {group.items.map((item) => (
              <NavMenuOption 
                key={item.id}
                icon={item.icon}
                color={item.color}
                bgColor={item.bgColor}
                label={item.label}
                description={item.description}
                onPress={() => handlePress(item.id)}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

// ==========================================
// 4. MAIN COMPONENT 2: MODAL SHEET
// ==========================================
export const ProfileModalSheet = ({ 
  visible, onClose, user, onLogout, onTriggerLogin, onNavigateToSupport, onNavigateToMenuOption 
}) => {
  const isGuest = !user;

  const handleShareApp = useCallback(async () => {
    try {
      await Share.share({ message: 'Join me in exploring scripture on the Machaira App!' });
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleQuickActionNavigate = useCallback((target) => {
    onClose();
    requestAnimationFrame(() => {
      onNavigateToMenuOption?.(target);
    });
  }, [onClose, onNavigateToMenuOption]);

  const handleItemPress = useCallback((id) => {
    onClose();
    requestAnimationFrame(() => {
      switch (id) {
        case 'logout': return onLogout?.();
        case 'share': return handleShareApp();
        case 'support': return onNavigateToSupport ? onNavigateToSupport() : onNavigateToMenuOption?.('support');
        default: return onNavigateToMenuOption?.(id);
      }
    });
  }, [onClose, onLogout, onNavigateToSupport, onNavigateToMenuOption, handleShareApp]);

  const modalListItems = useMemo(() => {
    const baseItems = MENU_SCHEMA.utilities.items.filter(item => !item.hideInModal);
    return isGuest ? baseItems : [
      ...baseItems, 
      { id: 'logout', label: 'Logout', icon: LogOut, color: '#ff3b30', bgColor: 'rgba(255, 59, 48, 0.1)' }
    ];
  }, [isGuest]);

  const ListHeaderLayout = useCallback(() => (
    <View style={styles.headerContainerBlockStack}>
      <ProfileCard user={user} />
      <QuickActions onNavigate={handleQuickActionNavigate} />
      <BackupBanner visible={isGuest} onPress={onTriggerLogin} />
      <MetricMatrix />

      <SectionHeader title={MENU_SCHEMA.engagement.title} />
      <View style={styles.rewardsGridMatrixContainer}>
        {MENU_SCHEMA.engagement.items.map((item) => {
          const IconComponent = item.icon;
          return (
            <Pressable 
              key={item.id} 
              style={({ pressed }) => [styles.gridInteractiveTileCard, pressed && styles.rowPressedStyle]} 
              onPress={() => handleItemPress(item.id)}
            >
              <View style={[styles.gridIconFrameWrapper, { backgroundColor: item.bgColor }]}>
                <IconComponent color={item.color} size={18} strokeWidth={2.2} />
              </View>
              <AppText type="semiBold" style={styles.gridTileLabelText}>{item.label}</AppText>
            </Pressable>
          );
        })}
      </View>
      <SectionHeader title={MENU_SCHEMA.utilities.title} />
    </View>
  ), [user, isGuest, onTriggerLogin, handleItemPress, handleQuickActionNavigate]);

  const renderModalRow = useCallback(({ item }) => (
    <NavMenuOption 
      icon={item.icon}
      color={item.color}
      bgColor={item.bgColor}
      label={item.label}
      description={item.description}
      onPress={() => handleItemPress(item.id)}
      style={styles.modalRowVerticalSpacer}
    />
  ), [handleItemPress]);

  return (
    <Modal 
      animationType="slide" 
      transparent 
      visible={visible} 
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlayScrim}>
        <Pressable style={styles.dismissalAbsoluteBackdrop} onPress={onClose} />
        <View style={styles.bottomSheetCardContainer}>
          <View style={styles.sheetIndicatorBar} />
          <View style={styles.sheetHeaderControls}>
            <AppText type="black" style={styles.sheetTitleLabel}>Account Options</AppText>
            <Pressable style={styles.closeCircleWrapper} onPress={onClose} hitSlop={6}>
              <X color="#ff3b30" size={14} strokeWidth={2.5} />
            </Pressable>
          </View>
          <FlatList
            data={modalListItems}
            keyExtractor={(item) => item.id}
            renderItem={renderModalRow}
            ListHeaderComponent={ListHeaderLayout}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListInnerScrollContentStyle}
          />
        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// 5. STYLES
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa', paddingHorizontal: 20 },
  headerContainerBlockStack: { marginBottom: 4 },
  modalOverlayScrim: { flex: 1, backgroundColor: 'rgba(9, 9, 11, 0.4)', justifyContent: 'flex-end' },
  dismissalAbsoluteBackdrop: { ...StyleSheet.absoluteFillObject },
  bottomSheetCardContainer: { backgroundColor: '#fafafa', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 10, height: SCREEN_HEIGHT_BOTTOM_SHEET, overflow: 'hidden' },
  sheetIndicatorBar: { width: 36, height: 4, backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetHeaderControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitleLabel: { fontSize: 22, color: '#09090b' },
  closeCircleWrapper: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255, 59, 48, 0.08)', alignItems: 'center', justifyContent: 'center' },
  flatListInnerScrollContentStyle: { paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  modalRowVerticalSpacer: { marginBottom: 8 },
  
  mainIdentityCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 24, gap: 14, marginTop: 10, position: 'relative', overflow: 'hidden', borderWidth: 1 },
  guestCardBg: { backgroundColor: '#ffffff', borderColor: 'rgba(255, 59, 48, 0.06)' },
  authCardBg: { backgroundColor: '#09090b', borderColor: '#18181b' },
  
  largeProfileAvatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: '#ff3b30' },
  largeFallbackAvatarCircle: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  fallbackCircleGuest: { backgroundColor: 'rgba(255, 59, 48, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.1)' },
  fallbackCircleAuth: { backgroundColor: 'rgba(255, 59, 48, 0.15)', borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.3)' },
  identityTextDetails: { flex: 1, justifyContent: 'center' },
  guestWelcomeSubtitle: { fontSize: 9, color: '#ff3b30', letterSpacing: 1.5, marginBottom: 2 },
  textDark: { fontSize: 16, color: '#09090b' },
  subDark: { fontSize: 12, color: '#71717a', marginTop: 1 },
  textLight: { fontSize: 16, color: '#ffffff' },
  subLight: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 1 },
  
  verifiedFloatingPillBadge: { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(255, 59, 48, 0.12)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.25)' },
  verifiedTextBadgeText: { color: '#ff3b30', fontSize: 8, letterSpacing: 0.8 },
  
  subProfileActionsContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  inlineProfileButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#ffffff', paddingVertical: 9, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.03)' },
  inlineProfileButtonText: { fontSize: 12, color: '#27272a' },
  bellIconButton: { width: 36, height: 36, borderRadius: 14, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.03)' },
  
  cloudSyncBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 59, 48, 0.04)', padding: 14, borderRadius: 20, gap: 12, borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.15)', marginTop: 12 },
  cloudSyncTextStack: { flex: 1 },
  cloudSyncHeadline: { fontSize: 13, color: '#ff3b30' },
  cloudSyncDescription: { fontSize: 11, color: '#6b7280', marginTop: 1, lineHeight: 15 },
  
  engagementStatsMatrixRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 20, paddingVertical: 14, marginTop: 12, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.03)' },
  statItemSquare: { flex: 1, alignItems: 'center', gap: 2, justifyContent: 'center' },
  verticalBorderDividerLine: { width: 1, height: 24, backgroundColor: 'rgba(0, 0, 0, 0.05)' },
  statPrimaryValue: { fontSize: 14, color: '#09090b', marginTop: 1 },
  statSecondaryLabel: { fontSize: 11, color: '#71717a' },
  groupSectionContainer: { marginTop: 2 },
  groupHeaderLabelWrapper: { marginTop: 18, marginBottom: 8 },
  groupSectionHeaderText: { fontSize: 11, color: '#ff3b30', opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1.2 },
  groupContentBoxStack: { gap: 8 },
  
  menuItemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.03)' },
  menuItemIconWrapper: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuItemTextStack: { flex: 1 },
  menuItemTitleText: { fontSize: 13, color: '#09090b' },
  menuItemDescText: { fontSize: 11, color: '#a1a1aa', marginTop: 1 },
  rewardsGridMatrixContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  gridInteractiveTileCard: { width: GRID_TILE_WIDTH, backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.03)', borderRadius: 16, padding: 14, alignItems: 'center', justifyContent: 'center', gap: 6 },
  gridIconFrameWrapper: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  gridTileLabelText: { fontSize: 12, color: '#27272a', textAlign: 'center' },
  rowPressedStyle: { opacity: 0.7 }
});