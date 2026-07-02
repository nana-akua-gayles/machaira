import { useRef, useCallback } from 'react';

export const useVerseScroll = (setNavHighlightKey) => {
  const scrollRef             = useRef(null);
  const versePositionsRef     = useRef({});
  const pendingScrollVerseRef = useRef(null);
  const lastReadVerseRef      = useRef(null);

  const handleVerseLayout = useCallback((verseNum, yPosition) => {
    versePositionsRef.current[verseNum] = yPosition;
    if (pendingScrollVerseRef.current === verseNum) {
      pendingScrollVerseRef.current = null;
      scrollRef.current?.scrollTo({ y: yPosition - 20, animated: true });
    }
  }, []);

  const scrollToVerseIfReady = useCallback((verseNum) => {
    const y = versePositionsRef.current[verseNum];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: y - 20, animated: true });
    } else {
      pendingScrollVerseRef.current = verseNum;
    }
  }, []);

  const handleScrollPositionChange = useCallback((yOffset) => {
    const positions = versePositionsRef.current;
    let closestVerse = null;
    let closestDist  = Infinity;
    Object.entries(positions).forEach(([verseNum, y]) => {
      const dist = yOffset - y;
      if (dist >= -20 && dist < closestDist) {
        closestDist  = dist;
        closestVerse = Number(verseNum);
      }
    });
    if (closestVerse !== null) lastReadVerseRef.current = closestVerse;
  }, []);

  return {
    scrollRef, versePositionsRef, pendingScrollVerseRef, lastReadVerseRef,
    handleVerseLayout, scrollToVerseIfReady, handleScrollPositionChange,
  };
};