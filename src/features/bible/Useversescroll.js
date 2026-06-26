import { useRef, useCallback } from 'react';

/**
 * Owns all scroll-position concerns for the reading view.
 *
 * Design principle — we never poll. Instead:
 *   1. Caller parks a verse number in pendingScrollVerseRef before the fetch.
 *   2. handleVerseLayout fires for each VerseRow as it mounts and measures.
 *   3. When the parked verse number matches, we scroll immediately and clear the ref.
 *
 * Refs exposed to the caller:
 *   scrollRef            — attach to the reading <ScrollView>
 *   versePositionsRef    — map of { verseNum → yOffset } built by VerseRow onLayout
 *   pendingScrollVerseRef— verse number parked before a chapter/translation fetch
 *   lastReadVerseRef     — closest verse to the viewport top; used by translation switch
 */
export const useVerseScroll = (setNavHighlightKey) => {
  const scrollRef             = useRef(null);
  const versePositionsRef     = useRef({});
  const pendingScrollVerseRef = useRef(null);
  const lastReadVerseRef      = useRef(null);

  /**
   * Called by every VerseRow's onLayout.
   * Records the y-position and fires a pending jump if this is the target verse.
   */
  const handleVerseLayout = useCallback((verseNum, yPosition) => {
    versePositionsRef.current[verseNum] = yPosition;

    if (pendingScrollVerseRef.current === verseNum) {
      pendingScrollVerseRef.current = null;
      scrollRef.current?.scrollTo({ y: yPosition - 20, animated: true });
      // Clear highlight after the full pulse animation (300 + 400 + 500 ms)
      setTimeout(() => setNavHighlightKey(null), 1400);
    }
  }, [setNavHighlightKey]);

  /**
   * Used by the inline chapter/verse picker for same-chapter verse jumps.
   * Positions already known → scroll immediately.
   * Not yet measured → park for handleVerseLayout to pick up.
   */
  const scrollToVerseIfReady = useCallback((verseNum) => {
    const y = versePositionsRef.current[verseNum];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: y - 20, animated: true });
    } else {
      pendingScrollVerseRef.current = verseNum;
    }
  }, []);

  /**
   * Attached to the reading ScrollView's onScroll (throttled to 100 ms).
   *   1. Clears any active ash nav highlight the moment the user scrolls.
   *   2. Tracks lastReadVerseRef for translation-switch scroll restoration.
   */
  const handleScrollPositionChange = useCallback((yOffset) => {
    // Functional form avoids a re-render when the highlight is already null
    setNavHighlightKey((prev) => (prev !== null ? null : prev));

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
  }, [setNavHighlightKey]);

  return {
    scrollRef,
    versePositionsRef,
    pendingScrollVerseRef,
    lastReadVerseRef,
    handleVerseLayout,
    scrollToVerseIfReady,
    handleScrollPositionChange,
  };
};