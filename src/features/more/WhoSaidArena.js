import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppText } from '../../components/AppText';

export const WhoSaidArena = ({ question, currentIndex, totalQuestions, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Animation values for editorial page-turn effect
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    setSelectedOption(null);
    setIsAnswered(false);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const handlePressOption = (name) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(name);

    // Normalize comparison by stripping prefixes (like 'A) ') from both the option and the answer key
    const cleanSelected = name.replace(/^[A-D]\)\s*/, '').trim().toLowerCase();
    const cleanAuthor = question?.author?.replace(/^[A-D]\)\s*/, '').trim().toLowerCase();
    const isCorrect = cleanSelected === cleanAuthor;

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setTimeout(() => {
      onAnswer(name);
    }, 900);
  };

  return (
    <Animated.View 
      style={[
        styles.arenaContainer, 
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.progressRow}>
        <AppText type="bold" style={styles.progressText}>
          QUESTION {currentIndex + 1} / {totalQuestions}
        </AppText>
      </View>

      <View style={styles.quoteBox}>
        <AppText type="bold" style={styles.quoteText}>{question?.quote}</AppText>
      </View>

      <View style={styles.optionsGrid}>
        {question?.options?.map((name, idx) => {
          const isSelected = selectedOption === name;
          const cleanName = name.replace(/^[A-D]\)\s*/, '').trim().toLowerCase();
          const cleanAuthor = question?.author?.replace(/^[A-D]\)\s*/, '').trim().toLowerCase();
          const isCorrectOption = cleanName === cleanAuthor;

          let btnStyle = styles.optionBtn;
          let textStyle = styles.optionText;

          if (isAnswered && isSelected) {
            if (isCorrectOption) {
              btnStyle = [styles.optionBtn, styles.optionCorrect];
              textStyle = [styles.optionText, styles.optionCorrectText];
            } else {
              btnStyle = [styles.optionBtn, styles.optionWrong];
              textStyle = [styles.optionText, styles.optionWrongText];
            }
          }

          return (
            <Pressable 
              key={idx} 
              disabled={isAnswered}
              style={({ pressed }) => [
                btnStyle,
                pressed && !isAnswered && styles.optionPressed
              ]} 
              onPress={() => handlePressOption(name)}
            >
              <AppText type="bold" style={textStyle}>{name.toUpperCase()}</AppText>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  arenaContainer: { marginTop: 10 },
  progressRow: { marginBottom: 20 },
  progressText: { fontSize: 12, letterSpacing: 2, color: 'red' },
  quoteBox: { 
    backgroundColor: '#ffffff', 
    borderWidth: 2, 
    borderColor: '#0f172a', 
    padding: 30, 
    marginBottom: 30,
    shadowColor: 'red',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  quoteText: { fontSize: 22, lineHeight: 30, color: '#0f172a' },
  optionsGrid: { gap: 12 },
  optionBtn: { 
    backgroundColor: '#ffffff', 
    borderWidth: 2, 
    borderColor: '#0f172a', 
    padding: 20, 
    alignItems: 'center' 
  },
  optionPressed: {
    backgroundColor: '#0f172a',
  },
  optionCorrect: {
    backgroundColor: '#166534',
    borderColor: '#166534',
  },
  optionCorrectText: {
    color: '#ffffff',
  },
  optionWrong: {
    backgroundColor: '#991b1b',
    borderColor: '#991b1b',
  },
  optionWrongText: {
    color: '#ffffff',
  },
  optionText: { fontSize: 14, color: '#0f172a', letterSpacing: 1 }
});