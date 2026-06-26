import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { AppText } from '../../components/AppText';
import { ASH } from './Constants';
import { cleanVerseText } from './Utils';

const VerseRow = ({ v, isSelected, isNavHighlight, isHighlighted, isUnderlined, hasNote, isSaved, fontSizeScale, dynamicLineHeight, dynamicVerseSpacing, onPress, onLongPress, onLayout }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isNavHighlight) {
      pulseAnim.setValue(0);
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1,   duration: 300, useNativeDriver: false }),
        Animated.delay(400),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 500, useNativeDriver: false }),
      ]).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [isNavHighlight, pulseAnim]);

  const animatedBg = pulseAnim.interpolate({
    inputRange:  [0, 0.4, 1],
    outputRange: ['rgba(53,42,72,0)', 'rgba(53,42,72,0.06)', 'rgba(53,42,72,0.12)'],
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
      onLayout={onLayout}
      style={[
        styles.verseLineBlockWrapper,
        isNavHighlight && !isHighlighted && styles.verseNavHighlightBorder,
        isHighlighted && styles.verseHighlightBorder,
        { marginBottom: dynamicVerseSpacing },
      ]}
    >
      {/* Persistent highlight fill */}
      {isHighlighted && (
        <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.highlightFill]} />
      )}

      {/* Selection tint */}
      {isSelected && !isHighlighted && (
        <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.selectionFill]} />
      )}

      {/* Nav-jump animated pulse */}
      {isNavHighlight && !isHighlighted && (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { backgroundColor: animatedBg, borderRadius: 8 }]} />
      )}

      <AppText style={[styles.miniVerseSuperscriptIndex, { fontSize: Math.max(10, fontSizeScale - 6) }]}>
        {v.verse}
      </AppText>

      <View style={styles.verseTextContainer}>
        <AppText style={[
  styles.coreReadingVerseString,
  { fontSize: fontSizeScale, lineHeight: dynamicLineHeight },
  isUnderlined && styles.underlinedVerse,
]}>
  {cleanVerseText(v.text)}
</AppText>

        {(hasNote || isSaved) && (
          <View style={styles.indicatorPillContainer}>
            {isSaved && <View style={[styles.indicatorPill, styles.savedPill]}><AppText style={styles.indicatorPillText}>Saved</AppText></View>}
            {hasNote && <View style={[styles.indicatorPill, styles.notePill]}><AppText style={styles.indicatorPillText}>Note</AppText></View>}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  verseLineBlockWrapper: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10 },
  verseNavHighlightBorder: { borderLeftWidth: 3, borderLeftColor: ASH.highlightBorder, paddingLeft: 5 },
  verseHighlightBorder: { borderLeftWidth: 3, borderLeftColor: ASH.highlightBorder, paddingLeft: 5 },
  highlightFill: { backgroundColor: ASH.highlightFill, borderRadius: 10 },
  selectionFill: { backgroundColor: 'rgba(53,42,72,0.06)', borderRadius: 10 },
  miniVerseSuperscriptIndex: { width: 28, minWidth: 28, color: '#352a48', fontWeight: '700', opacity: 0.45, marginTop: 1, flexShrink: 0 },
  verseTextContainer: { flex: 1, paddingLeft: 6 },
  coreReadingVerseString: { color: '#09090b', textAlign: 'left', fontWeight: '400' },
  underlinedVerse: { textDecorationLine: 'underline', textDecorationColor: '#352a48', textDecorationStyle: 'solid',},
  indicatorPillContainer: { flexDirection: 'row', gap: 6, marginTop: 4 },
  indicatorPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  savedPill: { backgroundColor: '#ef4444' },
  notePill: { backgroundColor: '#352a48' },
  indicatorPillText: { fontSize: 9, color: '#ffffff', fontWeight: '700' },
});

export default VerseRow;