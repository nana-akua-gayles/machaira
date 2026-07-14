import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Pressable, SafeAreaView, Alert, } from 'react-native';
import { AppText } from '../../components/AppText';
import { User, Music, BookOpenCheck, BookOpenText, Handshake, Settings, Globe2, Heart } from 'lucide-react-native';


const FULL_TEXT =
  'Having read the Machaira, walk in it! Find here additional bread for every hour.';

const CATEGORIES = {
  GROWTH: { color: '#ef4444', label: 'Spiritual Growth' },
  COMMUNITY: { color: '#f59e0b', label: 'Connect' },
  UTILITY: { color: '#352a48', label: 'Settings & Info' }
};

// Data Structure
 const TOOLS = [
  {
    id: 'articles',
    title: 'Articles',
    icon: BookOpenText,
    sub: 'Read, reflect and grow everyday',
    size: 'large',
    cat: CATEGORIES.GROWTH,
    screen: null,
  },
  {
    id: 'audio',
    title: 'Audios',
    icon: Music,
    sub: 'Audio messages of Apostle Bennie',
    size: 'small',
    cat: CATEGORIES.GROWTH,
    screen: null,
  },
  {
    id: 'game',
    title: 'Bible Trivia / Game',
    icon: BookOpenCheck,
    sub: 'See how much you know',
    size: 'small',
    cat: CATEGORIES.GROWTH,
    screen: null,
  },
  {
    id: 'partner',
    title: 'Be a Partner',
    icon: Handshake,
    sub: 'A co-labourer with God',
    size: 'small',
    cat: CATEGORIES.COMMUNITY,
    screen: null,
  },
  {
    id: 'social',
    title: 'Community',
    icon: Globe2,
    sub: 'Join Biblical conversations',
    size: 'small',
    cat: CATEGORIES.COMMUNITY,
    screen: null,
  },
  {
    id: 'about',
    title: 'About Author',
    icon: User,
    sub: 'The heart and mind behind Machaira',
    size: 'small',
    cat: CATEGORIES.UTILITY,
    screen: 'AboutAuthor',
  },
  {
    id: 'handle',
    title: 'Follow Us',
    icon: Heart,
    sub: 'Social Media handles',
    size: 'small',
    cat: CATEGORIES.UTILITY,
    screen: 'FollowUs',
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    sub: 'App preferences',
    size: 'small',
    cat: CATEGORIES.UTILITY,
    screen: 'Settings',
  },
];

export const MoreScreen = () => {
  const navigation = useNavigation();

  const renderSection = (category) => (
    <View style={styles.sectionHeader}>
      <AppText type="bold" style={styles.sectionLabel}>{category.label}</AppText>
      <View style={[styles.underline, { backgroundColor: category.color }]} />
    </View>
  );

const handleCardPress = (tool) => {
  if (tool.screen) {
    navigation.navigate(tool.screen);
  } else {
    Alert.alert(
      'Coming Soon',
      `${tool.title} will be available in a future update.`
    );
  }
};

  const [typedText, setTypedText] = useState('');

  useFocusEffect(
  useCallback(() => {
    let index = 0;
    let timeout;

    setTypedText('');

    const type = () => {
      if (index < FULL_TEXT.length) {
        setTypedText(FULL_TEXT.slice(0, index + 1));
        index++;
        timeout = setTimeout(type, 60);
      }
    };

    type();

    return () => clearTimeout(timeout);
  }, [])
);


const renderCard = (tool) => (
  <Pressable
    key={tool.id}
    style={[
      styles.card,
      tool.size === 'large'
        ? styles.cardLarge
        : styles.cardSmall,
    ]}
    onPress={() => handleCardPress(tool)}
  >
    <View
      style={[
        styles.iconWrapper,
        {
          backgroundColor: `${tool.cat.color}10`,
        },
      ]}
    >
      <tool.icon
        color={tool.cat.color}
        size={24}
      />
    </View>

    <View
      style={
        tool.size === 'large'
          ? styles.textContainer
          : undefined
      }
    >
      <AppText
        type="bold"
        style={styles.cardLabel}
      >
        {tool.title}
      </AppText>

      <AppText
        style={styles.cardSub}
        numberOfLines={2}
      >
        {tool.sub}
      </AppText>
    </View>
  </Pressable>
);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <AppText
        type="bold"
        style={styles.headerTitle}
    >
        More
    </AppText>

        <AppText type="semiBold" style={styles.missionStatement}>
          {typedText}
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {renderSection(CATEGORIES.GROWTH)}
        <View style={styles.gallery}>
          {TOOLS
  .filter(t => t.cat === CATEGORIES.GROWTH)
  .map(renderCard)}
        </View>

        {/* Community Section */}
        {renderSection(CATEGORIES.COMMUNITY)}
        <View style={styles.gallery}>
          {TOOLS
  .filter(t => t.cat === CATEGORIES.COMMUNITY)
  .map(renderCard)}
        </View>

        {/* Utility Section */}
        {renderSection(CATEGORIES.UTILITY)}
        <View style={styles.gallery}>
          {TOOLS
  .filter(t => t.cat === CATEGORIES.UTILITY)
  .map(renderCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { padding: 18, paddingBottom: 120 },
  headerContainer: { width: '100%', marginBottom: 20, alignItems: 'flex-start', marginTop: 10 },
headerTitle: {
    fontSize: 32,
    color: '#0f172a',
    marginBottom: 10,
    paddingLeft: 12,
},
  missionStatement: { fontSize: 17, color: '#ef4444', fontStyle: 'italic', textAlign: 'left',
     width: '100%', lineHeight: 26, paddingLeft: 12 },

  // Section Styles
  sectionHeader: { marginVertical: 16 },
  sectionLabel: { fontSize: 16, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5 },
  underline: { height: 2, width: 30, marginTop: 4, borderRadius: 2 },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
},
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1,   marginBottom: 12,
 borderColor: '#f1f5f9' },
  cardLarge: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#fef2f2' },
  cardSmall: { flexBasis: '48%', height: 150 },
  textContainer: {
  flex: 1,
},
  iconWrapper: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardLabel: { fontSize: 14, color: '#0f172a' },
  cardSub: { fontSize: 11, color: '#64748b', marginTop: 4 }
}); 
