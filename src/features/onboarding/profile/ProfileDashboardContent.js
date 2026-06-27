import React, { useMemo, useCallback } from 'react';
import { 
  View, StyleSheet, Pressable, ScrollView, Platform, 
  Image, Modal, Dimensions, Share, FlatList 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Flame, Gift, Globe, Notebook, User,
  MicVocal, FoldHands, Heart, MessageSquareWarning, 
  ChevronRight, LogOut, Trophy, Share2, Bell, UserCheck, 
  BookmarkCheck, X, UserX, Sparkles, KeyRound
} from 'lucide-react-native';

import { AppText } from '../../../components/AppText';

const { height } = Dimensions.get('window');
const SCREEN_HEIGHT_BOTTOM_SHEET = height * 0.88;

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
      { id: 'books', label: 'Favourite Books', icon: Heart, color: '#52525b', bgColor: 'rgba(244, 244, 245, 0.8)' },
      { id: 'support', label: 'Support / Feedback', icon: MessageSquareWarning, color: '#52525b', bgColor: 'rgba(244, 244, 245, 0.8)' },
      { id: 'share', label: 'Share App', icon: Share2, color: '#52525b', bgColor: 'rgba(244, 244, 245, 0.8)' },
    ]
  },
  // High-energy showcase items designed for Guest displays
  premiumPerks: [
    { id: 'notes', label: 'Study Notes', desc: 'Write thy meditations, store them up where neither moth nor rust corrupt, and find them on every device.', 
      icon: Notebook, color: '#ff3b30' },
    { id: 'streaks', label: 'Daily Streak Tracking', desc: 'Gather each morning, trace thy path in the word, and let consistency be thy strength.', 
      icon: Flame, color: '#f97316' },
    { id: 'rewards', label: 'Global Rank Milestones', desc: 'Run the race and earn verified badges with the saints from every tongue and tribe.', 
      icon: Trophy, color: '#eab308' },
  ]
};

// ==========================================
// 2. ATOMIC SUB-COMPONENTS
// ==========================================
const ProfileCard = ({ user }) => {
  const isGuest = !user || user.isGuest;
  return (
    <View style={[styles.mainIdentityCard, isGuest ? styles.guestCardBg : styles.authCardBg]}>
      {user?.photo && !user.isGuest ? (
        <Image source={{ uri: user.photo }} style={styles.largeProfileAvatar} />
      ) : (
        <View style={[styles.largeFallbackAvatarCircle, isGuest ? styles.fallbackCircleGuest : styles.fallbackCircleAuth]}>
          <User color={isGuest ? '#ff3b30' : '#ffffff'} size={22} strokeWidth={2.5} />
        </View>
      )}
      <View style={styles.identityTextDetails}>
        <AppText type="bold" style={isGuest ? styles.textDarkPremium : styles.textLight}>
          {isGuest ? 'Guest Account' : user?.name}
        </AppText>
        <AppText type="regular" style={isGuest ? styles.subDarkPremium : styles.subLight}>
          {isGuest ? 'Behold, thou art signed in as a guest' : user?.email}
        </AppText>
      </View>
      {isGuest && (
        <View style={styles.guestPillBadge}>
          <Sparkles color="#ffffff" size={10} fill="#ffffff" />
          <AppText type="bold" style={styles.guestPillText}>GUEST</AppText>
        </View>
      )}
    </View>
  );
};

const GuestPremiumShowcase = ({ onTriggerLogin }) => (
  <View style={styles.showcaseWrapper}>
    <View style={styles.headerBadgeRow}>
      <Sparkles color="#ff3b30" size={14} fill="#ff3b30" />
      <AppText type="bold" style={styles.showcaseTagline}>MACHAIRA PREMIUM</AppText>
    </View>
    <AppText type="bold" style={styles.showcaseHeadline}>Enter Into the Fullness</AppText>
    <AppText type="regular" style={styles.showcaseSubtitle}>
      A guest knocketh, and the door openeth...but remember to establish thy dwelling. That thy progress be lost not,
      thy insights stored like treasure, and thy streaks be counted in the Book of Life.
    </AppText>

    <View style={styles.perksStack}>
      {MENU_SCHEMA.premiumPerks.map(perk => {
        const IconComponent = perk.icon;
        return (
          <View key={perk.id} style={styles.perkCardRow}>
            <View style={[styles.perkIconContainer, { backgroundColor: `${perk.color}10` }]}>
              <IconComponent color={perk.color} size={18} strokeWidth={2.2} />
            </View>
            <View style={styles.perkTextContainer}>
              <AppText type="bold" style={styles.perkTitle}>{perk.label}</AppText>
              <AppText type="regular" style={styles.perkDesc}>{perk.desc}</AppText>
            </View>
          </View>
        );
      })}
    </View>

    <Pressable 
      style={({ pressed }) => [styles.actionButtonMain, pressed && styles.rowPressedStyle]} 
      onPress={onTriggerLogin}
    >
      <KeyRound color="#ffffff" size={16} strokeWidth={2.5} />
      <AppText type="bold" style={styles.actionButtonText}>Create Your Profile</AppText>
    </Pressable>
  </View>
);

const QuickActions = ({ onNavigate }) => (
  <View style={styles.subProfileActionsContainer}>
    <Pressable 
      style={({ pressed }) => [styles.inlineProfileButton, pressed && styles.rowPressedStyle]} 
      onPress={() => onNavigate('profile_details')}
    >
      <UserCheck color="#ff3b30" size={18} strokeWidth={2.2} />
      <AppText type="semiBold" style={styles.inlineProfileButtonText}>Profile</AppText>
    </Pressable>
    <Pressable 
      style={({ pressed }) => [styles.bellIconButton, pressed && styles.rowPressedStyle]} 
      onPress={() => onNavigate('notifications')}
    >
      <Bell color="#ff3b30" size={24} strokeWidth={2.2} />
    </Pressable>
  </View>
);

const MetricMatrix = () => (
  <View style={styles.engagementStatsMatrixRow}>
    <View style={styles.statItemSquare}>
      <Flame color="#ff3b30" size={18} strokeWidth={2.2} />
      <AppText type="bold" style={styles.statPrimaryValue}>12 Days</AppText>
      <AppText type="regular" style={styles.statSecondaryLabel}>Study Streak</AppText>
    </View>
    <View style={styles.verticalBorderDividerLine} />
    <View style={styles.statItemSquare}>
      <BookmarkCheck color="#ff3b30" size={18} strokeWidth={2.2} />
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
    <ChevronRight color={color === '#ff3b30' || color === '#ef4444' ? '#ff817b' : '#d4d4d8'} size={15} strokeWidth={2.2} />
  </Pressable>
);

// ==========================================
// 3. MAIN COMPONENT 1: DASHBOARD CONTENT
// ==========================================
export const ProfileDashboardContent = ({ 
  user, onLogout, onDeleteAccount, onTriggerLogin, onNavigateToSupport, onNavigateToMenuOption 
}) => {
  const insets = useSafeAreaInsets();
  const isGuest = !user || user.isGuest;

  const handlePress = useCallback((id) => {
    if (id === 'logout') onLogout?.();
    else if (id === 'delete_account') onDeleteAccount?.();
    else if (id === 'support') onNavigateToSupport?.();
    else onNavigateToMenuOption?.(id);
  }, [onLogout, onDeleteAccount, onNavigateToSupport, onNavigateToMenuOption]);

  const listData = useMemo(() => {
    if (isGuest) return []; 

    const baseUtilities = [...MENU_SCHEMA.utilities.items];
    baseUtilities.push(
      { id: 'logout', label: 'Logout', icon: LogOut, color: '#ff3b30', bgColor: 'rgba(255, 59, 48, 0.08)' },
      { id: 'delete_account', label: 'Delete Account', icon: UserX, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.06)' }
    );

    return [MENU_SCHEMA.engagement, { title: MENU_SCHEMA.utilities.title, items: baseUtilities }];
  }, [isGuest]);

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 60 }}
    >
      <ProfileCard user={user} />
      
      {isGuest ? (
        <GuestPremiumShowcase onTriggerLogin={onTriggerLogin} />
      ) : (
        <>
          <QuickActions onNavigate={(target) => onNavigateToMenuOption?.(target)} />
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
        </>
      )}
    </ScrollView>
  );
};

// ==========================================
// 4. MAIN COMPONENT 2: MODAL SHEET
// ==========================================
export const ProfileModalSheet = ({ 
  visible, onClose, user, onLogout, onDeleteAccount, onTriggerLogin, onNavigateToSupport, onNavigateToMenuOption 
}) => {
  const isGuest = !user || user.isGuest;

  const handleQuickActionNavigate = useCallback((target) => {
    onClose();
    requestAnimationFrame(() => {
      onNavigateToMenuOption?.(target);
    });
  }, [onClose, onNavigateToMenuOption]);

  const handleItemPress = useCallback((id) => {
    onClose();
    requestAnimationFrame(() => {
      if (id === 'logout') onLogout?.();
      else if (id === 'delete_account') onDeleteAccount?.();
      else if (id === 'support') onNavigateToSupport ? onNavigateToSupport() : onNavigateToMenuOption?.('support');
      else onNavigateToMenuOption?.(id);
    });
  }, [onClose, onLogout, onDeleteAccount, onNavigateToSupport, onNavigateToMenuOption]);

  const modalListItems = useMemo(() => {
    if (isGuest) return []; // Clean sheet framework layout

    const baseItems = MENU_SCHEMA.utilities.items.filter(item => !item.hideInModal);
    baseItems.push(
      { id: 'logout', label: 'Logout', icon: LogOut, color: '#ff3b30', bgColor: 'rgba(255, 59, 48, 0.08)' },
      { id: 'delete_account', label: 'Delete Account', icon: UserX, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.06)' }
    );
    return baseItems;
  }, [isGuest]);

  const ListHeaderLayout = useCallback(() => (
    <View style={styles.headerContainerBlockStack}>
      <ProfileCard user={user} />
      
      {isGuest ? (
        <GuestPremiumShowcase onTriggerLogin={() => { onClose(); onTriggerLogin?.(); }} />
      ) : (
        <>
          <QuickActions onNavigate={handleQuickActionNavigate} />
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
        </>
      )}
    </View>
  ), [user, isGuest, onTriggerLogin, handleItemPress, handleQuickActionNavigate, onClose]);

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
            <AppText type="black" style={styles.sheetTitleLabel}>
              {isGuest ? 'Go Deeper' : 'Account Options'}
            </AppText>
            <Pressable style={styles.closeCircleWrapper} onPress={onClose} hitSlop={6}>
              <X color="#ff3b30" size={14} strokeWidth={2.5} />
            </Pressable>
          </View>
          <FlatList
            data={modalListItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NavMenuOption 
                icon={item.icon}
                color={item.color}
                bgColor={item.bgColor}
                label={item.label}
                description={item.description}
                onPress={() => handleItemPress(item.id)}
                style={styles.modalRowVerticalSpacer}
              />
            )}
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
  container: { flex: 1, backgroundColor: '#f4f4f5', paddingHorizontal: 20 },
  headerContainerBlockStack: { marginBottom: 4 },
  modalOverlayScrim: { flex: 1, backgroundColor: 'rgba(9, 9, 11, 0.4)', justifyContent: 'flex-end' },
  dismissalAbsoluteBackdrop: { ...StyleSheet.absoluteFillObject },
  bottomSheetCardContainer: { backgroundColor: '#f4f4f5', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 10, height: SCREEN_HEIGHT_BOTTOM_SHEET, overflow: 'hidden' },
  sheetIndicatorBar: { width: 36, height: 4, backgroundColor: 'rgba(24, 24, 27, 0.1)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetHeaderControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitleLabel: { fontSize: 24, color: '#09090b' },
  closeCircleWrapper: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(24, 24, 27, 0.05)', alignItems: 'center', justifyContent: 'center' },
  flatListInnerScrollContentStyle: { paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  modalRowVerticalSpacer: { marginBottom: 8 },
  
  // Premium Glass/Metallic Theme Design Update
  mainIdentityCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 24, gap: 14, marginTop: 10, position: 'relative', overflow: 'hidden', borderWidth: 1 },
  guestCardBg: { 
    backgroundColor: '#352a48', 
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#18181b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4
  }, 
  authCardBg: { backgroundColor: '#7f1d1d', borderColor: '#991b1b' },
  
  largeProfileAvatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: '#ff3b30' },
  largeFallbackAvatarCircle: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  fallbackCircleGuest: { backgroundColor: '#352a48', borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.2)' },
  fallbackCircleAuth: { backgroundColor: '#352a48', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.25)' },
  identityTextDetails: { flex: 1, justifyContent: 'center' },
  textLight: { fontSize: 16, color: '#ffffff' },
  textDarkPremium: { fontSize: 16, color: '#ffffff', textShadowColor: 'rgba(255, 59, 48, 0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  subLight: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  subDarkPremium: { fontSize: 12, color: '#a1a1aa', marginTop: 2 },
  guestPillBadge: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  guestPillText: { fontSize: 9, color: '#ffffff', letterSpacing: 0.5 },

  // ==========================================
  // PREMIUM SHOWCASE UI LAYOUT (GLASS UPDATES)
  // ==========================================
  showcaseWrapper: { marginTop: 24 },
  headerBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  showcaseTagline: { fontSize: 11, color: '#ff3b30', letterSpacing: 1.5 },
  showcaseHeadline: { fontSize: 22, color: '#09090b', marginBottom: 6 },
  showcaseSubtitle: { fontSize: 13, color: '#71717a', lineHeight: 18, marginBottom: 24 },
  
  perksStack: { gap: 10, marginBottom: 28 },
  perkCardRow: { 
    flexDirection: 'row', 
    gap: 14, 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius: 20, 
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1
  },
  perkIconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  perkTextContainer: { flex: 1 },
  perkTitle: { fontSize: 14, color: '#09090b', marginBottom: 2 },
  perkDesc: { fontSize: 12, color: '#71717a', lineHeight: 16 },

  // Polished Obsidian/Dark Chrome Premium Button 
  actionButtonMain: {
    backgroundColor: '#352a48',
    borderRadius: 20,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#18181b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4
  },
  actionButtonText: { color: '#ffffff', fontSize: 15 },
  
  subProfileActionsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12, 
    marginTop: 14,
    paddingHorizontal: '8%' 
  },
  inlineProfileButton: { 
    flex: 1.25, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    backgroundColor: '#ffffff', 
    height: 54, 
    borderRadius: 27, 
    borderWidth: 1, 
    borderColor: 'rgba(0, 0, 0, 0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1
  },
  inlineProfileButtonText: { fontSize: 15, color: '#18181b' },
  bellIconButton: { 
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#ffffff', 
    height: 54, 
    borderRadius: 27, 
    borderWidth: 1, 
    borderColor: 'rgba(0, 0, 0, 0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1
  },
  
  engagementStatsMatrixRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 20, paddingVertical: 14, marginTop: 14, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.03)' },
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
  gridInteractiveTileCard: { width: '48.8%', backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.03)', borderRadius: 16, padding: 14, alignItems: 'center', justifyContent: 'center', gap: 6 },
  gridIconFrameWrapper: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  gridTileLabelText: { fontSize: 12, color: '#27272a', textAlign: 'center' },
  rowPressedStyle: { opacity: 0.7 }
});