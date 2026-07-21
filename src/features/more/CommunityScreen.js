import React from 'react';
import { ScrollView, StyleSheet, View, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import { AppText } from '../../components/AppText'; 

const RED = '#E11D48';
const DEEP_PURPLE = '#352a48';

const AnimatedPressable = ({ children, style, onPress }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[style, animatedStyle]}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPressIn={() => { scale.value = withSpring(0.95); if(onPress) onPress(); }}
        onPressOut={() => scale.value = withSpring(1)}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const CommunityScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Static Hero Section */}
      <LinearGradient colors={[DEEP_PURPLE, '#1a1424']} style={styles.headerBackground} />
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ChevronLeft color="white" size={32} />
      </TouchableOpacity>
      
      <AppText type="bold" style={styles.header}>The CommonwealthFold</AppText>

      {/* Fixed White Container */}
      <View style={styles.mainLayer}>
        
        {/* Scrollable Content Only */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>        
          
          <View style={styles.section}>
            <View style={styles.row}>
              <AppText type="bold" style={styles.sectionTitle}>Active Stories</AppText>
              <TouchableOpacity onPress={() => console.log('Create')}><AppText style={styles.addBtn}>+ Add</AppText></TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={[{id: '1'}, {id: '2'}]}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
              renderItem={({ index }) => (
                <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
                  <TouchableOpacity style={styles.storyWrapper}>
                    <LinearGradient colors={[RED, '#9F1239']} style={styles.gradientBorder}>
                      <View style={styles.storyCircleInner} />
                    </LinearGradient>
                    <AppText style={styles.storyName}>Story</AppText>
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          </View>

          <View style={styles.section}>
            <AppText type="bold" style={[styles.sectionTitle, {paddingHorizontal: 30}]}>Apostolic Shorts</AppText>
            <FlatList
              horizontal
              data={[{id: '1'}, {id: '2'}]}
              contentContainerStyle={{ paddingLeft: 30, paddingRight: 30 }}
              renderItem={() => (
                <AnimatedPressable style={styles.shortCard}>
                   <View style={styles.shortOverlay}>
                      <View style={styles.playIcon}><AppText style={{color: 'white'}}>▶</AppText></View>
                   </View>
                </AnimatedPressable>
              )}
            />
          </View>

          <View style={[styles.groupSection, {paddingHorizontal: 30}]}>
            <View style={[styles.row, {paddingHorizontal: 0}]}>
              <AppText type="bold" style={styles.sectionTitle}>Faith Discussions</AppText>
              <TouchableOpacity onPress={() => console.log('Create')}><AppText style={styles.addBtn}>+ Create</AppText></TouchableOpacity>
            </View>
            <AnimatedPressable style={styles.studyGroupCard} onPress={() => console.log('Join')}>
              <View style={styles.groupImagePlaceholder} />
              <View style={styles.groupInfo}>
                <AppText type="bold" style={styles.groupTitle}>Machaira Official</AppText>
                <AppText style={styles.groupMembers}>1.3k Members • Join Now</AppText>
              </View>
            </AnimatedPressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1424' },
  headerBackground: { position: 'absolute', top: 0, width: '100%', height: 260 },
  backButton: { position: 'absolute', top: 50, left: 20, width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  header: { fontSize: 28, color: '#FFF', paddingHorizontal: 30, marginTop: 120, marginBottom: 30, letterSpacing: -0.5 },
  
  mainLayer: { flex: 1, backgroundColor: '#F8FAFC', borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingTop: 40, overflow: 'hidden'
  },
  scrollContent: { paddingBottom: 80 },
  section: { marginBottom: 40 },
  groupSection: { marginBottom: 80 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 20, color: DEEP_PURPLE, letterSpacing: 0.5, marginBottom: 30  },
  addBtn: { color: RED, fontSize: 14, fontWeight: '800', textTransform: 'uppercase' },
  
  storyWrapper: { alignItems: 'center', marginHorizontal: 10 },
  gradientBorder: { width: 80, height: 80, borderRadius: 40, padding: 3 },
  storyCircleInner: { flex: 1, borderRadius: 37, backgroundColor: '#F8FAFC' },
  storyName: { marginTop: 10, color: DEEP_PURPLE, fontSize: 11, fontWeight: '600' },

  shortCard: { width: 150, height: 230, borderRadius: 35, backgroundColor: DEEP_PURPLE, marginRight: 20, justifyContent: 'center', alignItems: 'center' },
  shortOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  playIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },

  studyGroupCard: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#FFF', borderRadius: 35, borderWidth: 1, borderColor: '#F1F5F9', elevation: 8, shadowColor: DEEP_PURPLE, shadowOpacity: 0.1, shadowRadius: 15 },
  groupImagePlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F1F5F9' },
  groupInfo: { marginLeft: 10 },
  groupTitle: { fontSize: 17, color: DEEP_PURPLE, marginTop: 3  },
  groupMembers: { fontSize: 13, color: '#64748B', marginTop: 3 }
});