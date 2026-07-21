import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  ScrollView,
  Keyboard 
} from 'react-native';
import { Sparkles, ArrowUp, BookOpen, Heart, Calendar, MessageCircle, Lightbulb, Music, Zap, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { AppText } from '../../components/AppText';
import { useTheme } from '../../context/ThemeContext';

export default function AIChatScreen({ navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight(); 
  const [input, setInput] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const devotions = [
    { label: 'Explain a Verse', icon: <BookOpen size={20} color={colors.primary} /> },
    { label: 'Daily Prayer', icon: <Heart size={20} color={colors.primary} /> },
    { label: 'Morning Reflection', icon: <Calendar size={20} color={colors.primary} /> },
    { label: 'Biblical Wisdom', icon: <Lightbulb size={20} color={colors.primary} /> },
    { label: 'Theological Doubt', icon: <MessageCircle size={20} color={colors.primary} /> },
    { label: 'Worship Playlist', icon: <Music size={20} color={colors.primary} /> },
    { label: 'Quick Inspiration', icon: <Zap size={20} color={colors.primary} /> },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* 1. FIXED HEADER */}
      <View style={[styles.header, { marginTop: insets.top, borderColor: colors.border }]}>
        <TouchableOpacity 
          onPress={() => Keyboard.dismiss()} 
          style={styles.backBtn}
        >
          {isKeyboardVisible && <X color={colors.text} size={24} />}
        </TouchableOpacity>

        <AppText type="bold" style={{ color: colors.text, fontSize: 18 }}>Machaira AI</AppText>
        
        {/* Added a placeholder view to keep the title centered */}
        <View style={{ width: 40 }} />
      </View>

      {/* 2. SCROLLABLE CONTENT */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroContainer}>
          <Sparkles size={48} color={colors.primary} style={{ marginBottom: 20 }} />
          <AppText type="bold" style={[styles.title, { color: colors.text }]}>SHALOM!</AppText>
          <AppText style={[styles.subtitle, { color: colors.textSecondary }]}>
            What do you need help with today?
          </AppText>

          <View style={styles.grid}>
            {devotions.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {item.icon}
                <AppText type="semiBold" style={[styles.cardText, { color: colors.text }]}>{item.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 3. INPUT AREA */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.inputWrapper, { 
          backgroundColor: colors.background, 
          borderTopColor: colors.border,
          paddingBottom: tabBarHeight + 12,
        }]}>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput 
              style={[styles.input, { color: colors.text }]}
              placeholder="Ask the Machaira AI anything..."
              placeholderTextColor={colors.textSecondary}
              value={input}
              onChangeText={setInput}
              multiline
            />
            <Pressable style={[styles.sendBtn, { backgroundColor: input ? colors.primary : colors.border }]}>
              <ArrowUp color={input ? "#fff" : colors.textSecondary} size={20} strokeWidth={3} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1 
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  heroContainer: { alignItems: 'center' },
  title: { fontSize: 32, marginBottom: 12 },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 40, lineHeight: 26 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 400 },
  card: { width: '45%', padding: 16, borderRadius: 20, borderWidth: 1, alignItems: 'center', gap: 12, marginBottom: 8 },
  cardText: { fontSize: 12, textAlign: 'center' },
  inputWrapper: { padding: 16, borderTopWidth: 1 },
  inputContainer: { flexDirection: 'row', borderRadius: 30, padding: 8, paddingLeft: 16, alignItems: 'center', borderWidth: 1 },
  input: { flex: 1, fontSize: 15, paddingRight: 10, minHeight: 40, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }
});