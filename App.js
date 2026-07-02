import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, Image, StyleSheet, StatusBar, Platform, Pressable, Alert 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Home, Book, ShoppingBag, FolderHeart, LayoutGrid } from 'lucide-react-native';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_900Black} from '@expo-google-fonts/montserrat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { supabase } from './src/config/supabaseClient';
import { AppText } from './src/components/AppText';
import { OnboardingScreen } from './src/features/onboarding/OnboardingScreen';
import HomeScreen from './src/features/home/HomeScreenContent';
import { BibleTabContent } from './src/features/bible/BibleTabContent';
import { SupportFeedbackScreen } from './src/features/onboarding/profile/AccUtilities/SupportFeedbackScreen'; 
import MyNotesTabContent from './src/features/onboarding/profile/AccUtilities/MyNotes'; 
import { Testimony } from './src/features/onboarding/profile/AccUtilities/Testimony'; 
import { FavoriteBooksScreen } from './src/features/onboarding/profile/AccUtilities/FavoriteBooks'; 
import machairabot from './assets/images/machairabot.png';

SplashScreen.preventAutoHideAsync().catch(() => {});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DISK_USER_CACHE_KEY = '@machaira_authenticated_user_cache';

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
  onNavigateToSupport, onNavigateToMenuOption, onLogout, onTriggerLogin, onChangeAccount, onDeleteAccount 
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
      onLogout={onLogout}
      onTriggerLogin={onTriggerLogin}
      onChangeAccount={onChangeAccount}
      onDeleteAccount={onDeleteAccount}
    />
  </View>
));

// ==========================================
// CORE TAB NAVIGATION COMPONENT
// ==========================================
function BaseTabNavigator({ route, navigation, user, onLogout, onTriggerLogin, onChangeAccount, onDeleteAccount }) {
  const insets = useSafeAreaInsets();
  const [profileVisible, setProfileVisible] = useState(false);

  const activeUserContext = useMemo(() => user, [user]);

  const renderIcon = useCallback((IconComponent, focused, color) => (
    <View style={styles.iconContainer}>
      <IconComponent color={color} size={20} strokeWidth={focused ? 2.0 : 1.5} />
      {focused && <View style={styles.minimalDot} />}
    </View>
  ), []);

  const handleMenuOption = useCallback((targetId) => {
    setProfileVisible(false);
    if (targetId === 'notes' || targetId === 'Saved') {
      navigation.navigate('MyNotes');
    } else if (targetId === 'testimony') {
      navigation.navigate('Testimony');
    } else if (targetId === 'books') {
      navigation.navigate('FavoriteBooks');
    } else if (targetId === 'support') {
      navigation.navigate('SupportFeedback');
    }
  }, [navigation]);

  const handleSupportNavigation = useCallback(() => {
    navigation.navigate('SupportFeedback');
  }, [navigation]);

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
          headerShown: false,
          tabBarIcon: ({ color, focused }) => renderIcon(Home, focused, color)
        }}
      >
        {(props) => (
          <MemoizedHomeScreen 
            {...props}
            user={activeUserContext} 
            profileVisible={profileVisible} 
            setProfileVisible={setProfileVisible} 
            onLogout={onLogout}
            onTriggerLogin={onTriggerLogin}
            onChangeAccount={onChangeAccount}
            onDeleteAccount={onDeleteAccount}
            onNavigateToSupport={handleSupportNavigation} 
            onNavigateToMenuOption={handleMenuOption}
          />
        )}
      </Tab.Screen>

      <Tab.Screen 
        name="Bible"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => renderIcon(Book, focused, color)
        }}
      >
        {() => <View style={styles.flexOne}><BibleTabContent tabBarHeight={64 + insets.bottom} /></View>}
      </Tab.Screen>

      <Tab.Screen 
        name="AI_Chat" 
        component={AIChatScreen} 
        options={{
          headerShown: false,
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
        name="Library" 
        options={{ headerShown: false, tabBarIcon: ({ color, focused }) => renderIcon(FolderHeart, focused, color) }}
      >
        {() => <CenterScreen title="Library Screen" />}
      </Tab.Screen>

      <Tab.Screen 
          name="More" 
          options={{ headerShown: false, tabBarIcon: ({ color, focused }) => renderIcon(LayoutGrid, focused, color) }}
        >
          {() => <CenterScreen title="More Screen" />}
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

  const writeProfileDiskCache = async (profileObj) => {
    try {
      if (profileObj) {
        await AsyncStorage.setItem(DISK_USER_CACHE_KEY, JSON.stringify(profileObj));
      }
    } catch (err) {
      console.warn("Disk writing write validation fault:", err);
    }
  };

  const mapSupabaseUserToState = useCallback((user) => {
    const profileModel = {
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User Account",
      email: user.email,
      photo: user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      isLoggedOut: false
    };
    setAuthenticatedUser(profileModel);
    writeProfileDiskCache(profileModel);
  }, []);

  const handleGlobalLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      console.warn("Error signing out from Supabase layer:", e);
    }
  }, []);

  const handleSwitchToNewAccount = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(DISK_USER_CACHE_KEY);
      setAuthenticatedUser(null);
      setHasCompletedOnboarding(false);
    } catch (err) {
      console.warn("Failed clearing core layout storage identity:", err);
    }
  }, []);

  const handleAccountDeletion = useCallback(async () => {
    try {
      console.log("Processing secure account deletion for UID:", authenticatedUser?.id);
      const { data, error } = await supabase.rpc('delete_user_account_trigger');
      
      if (error) throw new Error(error.message);

      console.log("Database confirmation received successfully:", data);
      await AsyncStorage.removeItem(DISK_USER_CACHE_KEY);
      setAuthenticatedUser(null);
      await handleGlobalLogout();
      setHasCompletedOnboarding(false);
      Alert.alert("Success", "Your profile has been permanently removed.");
    } catch (e) {
      console.warn("Error running account deletion flow:", e);
      Alert.alert("Deletion Failed", `Server rejected data teardown request: ${e.message}`);
    }
  }, [authenticatedUser, handleGlobalLogout]);

  const handleTriggerLogin = useCallback(() => {
    setHasCompletedOnboarding(false);
  }, []);

  useEffect(() => {
    let authSubscription;

    async function prepareApplication() {
      try {
        const cachedPayload = await AsyncStorage.getItem(DISK_USER_CACHE_KEY);
        if (cachedPayload) {
          const parsedUser = JSON.parse(cachedPayload);
          setAuthenticatedUser(parsedUser);
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          mapSupabaseUserToState(session.user);
          setHasCompletedOnboarding(true);
        } else if (cachedPayload) {
          setHasCompletedOnboarding(true);
        }

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          console.log(`Supabase Auth Transaction Event: ${event}`);
          
          if (session?.user) {
            mapSupabaseUserToState(session.user);
            setHasCompletedOnboarding(true);
          } else if (event === 'SIGNED_OUT') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            setAuthenticatedUser(prev => {
              if (!prev) return null;
              const closedState = { ...prev, isLoggedOut: true };
              writeProfileDiskCache(closedState);
              return closedState;
            });
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
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, [mapSupabaseUserToState]);

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
                    isReturningFromGuest={authenticatedUser?.isLoggedOut ?? false}
                    savedUserContext={authenticatedUser}
                  />
                )}
              </Stack.Screen>
            ) : (
              <Stack.Group>
                <Stack.Screen name="MainTabs">
                  {(props) => (
                    <MemoizedBaseTabNavigator 
                      {...props} 
                      user={authenticatedUser} 
                      onLogout={handleGlobalLogout} 
                      onTriggerLogin={handleTriggerLogin}
                      onChangeAccount={handleSwitchToNewAccount}
                      onDeleteAccount={handleAccountDeletion}
                    />
                  )}
                </Stack.Screen>

                <Stack.Screen name="SupportFeedback" component={SupportFeedbackScreen} />
                <Stack.Screen name="MyNotes" component={MemoizedMyNotes} />
                <Stack.Screen name="Testimony" component={MemoizedTestimony} />
                <Stack.Screen name="FavoriteBooks" component={MemoizedFavoriteBooks} />
              </Stack.Group>
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
  navButtonAI: { justifyContent: 'flex-start', alignItems: 'center' },
  navButtonAIFocused: { transform: [{ scale: 1.05 }] },
  aiIconAnchor: { width: 64, height: 54, borderRadius: 12, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 4 } }) },
  aiIconAnchorFocused: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#ef4444' },
  aiNavImage: { width: 22, height: 22, tintColor: '#ef4444', marginBottom: 2 },
  aiButtonLabel: { color: '#ef4444', fontSize: 9, letterSpacing: -0.2, textAlign: 'center', fontWeight: '700' },
  navLabel: { fontSize: 10, marginTop: 4, textAlign: 'center', fontWeight: '600' }
});