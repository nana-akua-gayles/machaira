import React, { useState } from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react-native';
import { AppText } from '../../../../components/AppText';

const FAQ_DATA = [
  { id: '1', q: 'Can I read the Machaira offline?', a: 'Yes! Every episode is fully accessible even without an internet connection.' },
  { id: '2', q: 'App is not opening after download.', a: 'Restart your phone and check your internet connection. Be sure you have the updated version.' },
  { id: '3', q: 'Is my note data synchronized?', a: 'Absolutely. As long as you are logged into your authenticated account, your notes and highlights synchronize automatically across devices.' },
  { id: '4', q: 'How do I log in as a guest?', a: 'Tap on the Guest Profile, On the pop up menu, click on Sign In Today. You will be redirected to log in with your google account.' },
];

export default function FAQSection() {
  const { width } = useWindowDimensions();
  const [expandedId, setExpandedId] = useState(null);

  const isLargeScreen = width > 450;
  const columnWidth = isLargeScreen ? '48%' : '100%';

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <HelpCircle color="#a855f7" size={18} style={{ marginRight: 8 }} />
        <AppText type="bold" style={styles.title}>Frequently Asked Questions</AppText>
      </View>

      {/* Grid structure handles column flow alignment across variations */}
      <View style={[styles.gridContainer, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
        {FAQ_DATA.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <Pressable 
              key={item.id} 
              onPress={() => toggleExpand(item.id)}
              style={[styles.faqCard, { width: columnWidth }]}
            >
              <View style={styles.cardRow}>
                <AppText type="semiBold" style={styles.questionText}>{item.q}</AppText>
                {isExpanded ? <ChevronUp color="#a855f7" size={16} /> : <ChevronDown color="#6b21a8" size={16} />}
              </View>
              
              {isExpanded && (
                <View style={styles.answerWrapper}>
                  <AppText type="regular" style={styles.answerText}>{item.a}</AppText>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12, paddingHorizontal: 4, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 15, color: '#3b0764', letterSpacing: -0.2 },
  gridContainer: { flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  faqCard: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#f3e8ff',
    ...Platform.select({
      ios: { shadowColor: '#3b0764', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6 },
      android: { elevation: 2 }
    })
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  questionText: { fontSize: 13, color: '#3b0764', flex: 1, lineHeight: 18 },
  answerWrapper: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f3e8ff' },
  answerText: { fontSize: 12, color: '#6b21a8', lineHeight: 18 }
});