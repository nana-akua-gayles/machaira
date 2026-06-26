import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, Image, StyleSheet, StatusBar, Platform 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Home, Book, ShoppingBag, FolderHeart } from 'lucide-react-native';
import { 
  useFonts, 
  Montserrat_400Regular, 
  Montserrat_600SemiBold, 
  Montserrat_700Bold, 
  Montserrat_900Black 
} from '@expo-google-fonts/montserrat';

import { supabase } from './src/config/supabaseClient';
import { AppText } from './src/components/AppText';
import { OnboardingScreen } from './src/features/onboarding/OnboardingScreen';
import HomeScreen from './src/features/home/HomeScreenContent';
import { BibleTabContent } from './src/features/bible/BibleTabContent';
import { SupportFeedbackScreen } from './src/features/onboarding/profile/SupportFeedbackScreen'; 
import MyNotesTabContent from './src/features/onboarding/profile/MyNotes'; 
import { Testimony } from './src/features/onboarding/profile/Testimony'; 
import { FavoriteBooksScreen } from './src/features/onboarding/profile/FavoriteBooks'; 
import machairabot from './assets/images/machairabot.png';

SplashScreen.preventAutoHideAsync().catch(() => {});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ==========================================
// STATIC & MEMOIZED SUB-SCREENS
// ==========================================
const CenterScreen = React.memo(({ title }) => (
  <View style={styles.center}>
    <AppText type="bold">{title}</AppText>
  </View>
));

const AIChatScreen = React.memo(() => (
  <View style={styles.aiCenter}>
    <View style={styles.fallbackContainer}>
      <Image source={machairabot} style={styles.aiLogo} resizeMode="contain" />
      <AppText type="semiBold" style={styles.fallbackText}>
        Machaira AI Chat coming soon...
      </AppText>
    </View>
  </View>
));

const MemoizedMyNotes = React.memo(({ navigation }) => (
  <MyNotesTabContent 
    onBack={() => navigation.goBack()} 
    onNavigateToCreateNote={() => console.log('Compose notes pipeline triggered...')} 
  />
));

const MemoizedTestimony = React.memo(({ navigation }) => (
  <Testimony 
    onBack={() => navigation.goBack()} 
    onNavigateToCreate={() => console.log('Create testimony context triggered...')} 
  />
));

const MemoizedFavoriteBooks = React.memo(({ navigation }) => (
  <FavoriteBooksScreen onBack={() => navigation.goBack()} />
));

const MemoizedHomeScreen = React.memo(({ 
  navigation, route, user, profileVisible, setProfileVisible, 
  onNavigateToSupport, onNavigateToMenuOption 
}) => (
  <View style={[styles.flexOne, { paddingTop: useSafeAreaInsets().top }]}>
    <HomeScreen 
      navigation={navigation}
      route={route}
      user={user} 
      profileVisible={profileVisible} 
      setProfileVisible={setProfileVisible} 
      onNavigateToSupport={onNavigateToSupport} 
      onNavigateToMenuOption={onNavigateToMenuOption}
    />
  </View>
));

// ==========================================
// CORE TAB NAVIGATION COMPONENT
// ==========================================
function BaseTabNavigator({ route, navigation, user }) {
  const insets = useSafeAreaInsets();
  const [profileVisible, setProfileVisible] = useState(false);

  const activeUserContext = useMemo(() => 
    user ? user : { name: 'Guest User', photo: null, email: '', isGuest: true },
  [user]);

  const renderIcon = useCallback((IconComponent, focused, color) => (
    <View style={styles.iconContainer}>
      <IconComponent color={color} size={20} strokeWidth={focused ? 2.0 : 1.5} />
      {focused && <View style={styles.minimalDot} />}
    </View>
  ), []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ef4444', 
        tabBarInactiveTintColor: '#94a3b8', 
        tabBarLabelStyle: styles.navLabel,
        tabBarStyle: [
          styles.footer, 
          { height: 64 + insets.bottom, paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }
        ],
      }}
    >
      <Tab.Screen 
        name="Home"
        options={{
          tabBarIcon: ({ color, focused }) => renderIcon(Home, focused, color)
        }}
      >
        {(props) => (
          <MemoizedHomeScreen 
            {...props}
            user={activeUserContext} 
            profileVisible={profileVisible} 
            setProfileVisible={setProfileVisible} 
            onNavigateToSupport={() => props.navigation.navigate('SupportFeedback')} 
            onNavigateToMenuOption={useCallback((targetId) => {
              setProfileVisible(false);
              if (targetId === 'notes' || targetId === 'Saved') {
                props.navigation.navigate('MyNotes');
              } else if (targetId === 'testimony') {
                props.navigation.navigate('Testimony');
              } else if (targetId === 'books') {
                props.navigation.navigate('FavoriteBooks');
              }
            }, [props.navigation])}
          />
        )}
      </Tab.Screen>

      <Tab.Screen 
        name="Bible"
        options={{
          tabBarIcon: ({ color, focused }) => renderIcon(Book, focused, color)
        }}
      >
        {() => <View style={styles.flexOne}><BibleTabContent tabBarHeight={64 + insets.bottom} /></View>}
      </Tab.Screen>

      <Tab.Screen 
        name="AI_Chat" 
        component={AIChatScreen} 
        options={{
          tabBarButton: (props) => (
            <Pressable 
              {...props} 
              style={[
                props.style, 
                styles.navButtonAI,
                props.accessibilityState?.selected && styles.navButtonAIFocused
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open Machaira AI Chat"
            >
              <View style={[
                styles.aiIconAnchor,
                props.accessibilityState?.selected && styles.aiIconAnchorFocused
              ]}>
                <Image source={machairabot} style={styles.aiNavImage} resizeMode="contain" />
                <AppText type="bold" numberOfLines={1} style={styles.aiButtonLabel}>
                  Machaira AI
                </AppText>
              </View>
            </Pressable>
          ),
        }} 
      />

      <Tab.Screen 
        name="Store" 
        options={{ tabBarIcon: ({ color, focused }) => renderIcon(ShoppingBag, focused, color) }}
      >
        {() => <CenterScreen title="Store Screen" />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Library" 
        options={{ tabBarIcon: ({ color, focused }) => renderIcon(FolderHeart, focused, color) }}
      >
        {() => <CenterScreen title="Library Screen" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const MemoizedBaseTabNavigator = React.memo(BaseTabNavigator);

// ==========================================
// MASTER APPLICATION CONTAINER (ROOT)
// ==========================================
export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular, 
    'Montserrat-SemiBold': Montserrat_600SemiBold, 
    'Montserrat-Bold': Montserrat_700Bold, 
    'Montserrat-Black': Montserrat_900Black,
  });

  const mapSupabaseUserToState = useCallback((user) => {
    setAuthenticatedUser({
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User Account",
      email: user.email,
      photo: user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    });
  }, []);

  useEffect(() => {
    let authSubscription;

    async function prepareApplication() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          mapSupabaseUserToState(session.user);
          setHasCompletedOnboarding(true);
        }

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          console.log(`Supabase Auth Transaction Event: ${event}`);
          
          if (session?.user) {
            mapSupabaseUserToState(session.user);
            setHasCompletedOnboarding(true);
          } else if (event === 'SIGNED_OUT') {
            setAuthenticatedUser(null);
            setHasCompletedOnboarding(false);
          }
        });
        
        authSubscription = data?.subscription;
      } catch (e) {
        console.warn("Storage runtime initialization error:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepareApplication();

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [mapSupabaseUserToState]);

  const navigationKey = useMemo(() => {
    return authenticatedUser ? `auth-${authenticatedUser.id}` : 'guest-layout';
  }, [authenticatedUser]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  const handleExploreAsGuest = useCallback(() => {
    setAuthenticatedUser(null);
    setHasCompletedOnboarding(true);
  }, []);

  const handleAuthSuccess = useCallback((data) => { 
    if (data?.user) {
      mapSupabaseUserToState(data.user);
      setHasCompletedOnboarding(true);
    }
  }, [mapSupabaseUserToState]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.flexOne} onLayout={onLayoutRootView}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
          
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
            {!hasCompletedOnboarding ? (
              <Stack.Screen name="Onboarding">
                {() => (
                  <OnboardingScreen 
                    onExploreAsGuest={handleExploreAsGuest} 
                    onAuthSuccess={handleAuthSuccess} 
                    onEmailAuthPress={() => console.log('Email auth requested...')}
                  />
                )}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen key={navigationKey} name="MainTabs">
                  {(props) => <MemoizedBaseTabNavigator {...props} user={authenticatedUser} />}
                </Stack.Screen>

                <Stack.Screen name="SupportFeedback" component={SupportFeedbackScreen} />
                <Stack.Screen name="MyNotes" component={MemoizedMyNotes} />
                <Stack.Screen name="Testimony" component={MemoizedTestimony} />
                <Stack.Screen name="FavoriteBooks" component={MemoizedFavoriteBooks} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  aiCenter: { flex: 1, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: '#f8fafc' },
  fallbackContainer: { backgroundColor: '#ffffff', borderRadius: 16, padding: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  fallbackText: { color: '#64748b', fontSize: 14, marginTop: 8 },
  aiLogo: { width: 64, height: 64, tintColor: '#ef4444', marginBottom: 12 },
  footer: { flexDirection: 'row', backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f1f5f9', position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'visible', ...Platform.select({ ios: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.03, shadowRadius: 10 }, android: { elevation: 8 } }) },
  iconContainer: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  minimalDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#ef4444', position: 'absolute', bottom: -6 },
  navButtonAI: { top: -6, justifyContent: 'flex-start', alignItems: 'center' },
  navButtonAIFocused: { transform: [{ scale: 1.05 }] },
  aiIconAnchor: { width: 64, height: 54, borderRadius: 12, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 4 } }) },
  aiIconAnchorFocused: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#ef4444' },
  aiNavImage: { width: 22, height: 22, tintColor: '#ef4444', marginBottom: 2 },
  aiButtonLabel: { color: '#ef4444', fontSize: 9, letterSpacing: -0.2, textAlign: 'center', fontWeight: '700' },
  navLabel: { fontSize: 10, marginTop: 4, textAlign: 'center', fontWeight: '600' }
});