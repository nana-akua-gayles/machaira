import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONT_DEFAULT, FONT_MIN, FONT_MAX, FONT_STEP, STORAGE_KEYS } from './Constants';

export const useBibleStorage = () => {
  const [savedVerses,       setSavedVerses]      = useState({});
  const [verseNotes,        setVerseNotes]        = useState({});
  const [highlightedVerses, setHighlightedVerses] = useState(new Set());
  const [underlinedVerses,  setUnderlinedVerses]  = useState(new Set());
  const [fontSizeScale,     setFontSizeScale]     = useState(FONT_DEFAULT);

  useEffect(() => {
    (async () => {
      try {
        const [storedSaved, storedNotes, storedHighlights, storedUnderlines, storedFont] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.savedVerses),
          AsyncStorage.getItem(STORAGE_KEYS.verseNotes),
          AsyncStorage.getItem(STORAGE_KEYS.highlights),
          AsyncStorage.getItem(STORAGE_KEYS.underlines),
          AsyncStorage.getItem(STORAGE_KEYS.fontSize),
        ]);
        if (storedSaved)       setSavedVerses(JSON.parse(storedSaved));
        if (storedNotes)       setVerseNotes(JSON.parse(storedNotes));
        if (storedHighlights)  setHighlightedVerses(new Set(JSON.parse(storedHighlights)));
        if (storedUnderlines)  setUnderlinedVerses(new Set(JSON.parse(storedUnderlines)));
        if (storedFont)        setFontSizeScale(Number(storedFont));
      } catch (e) { console.error('[useBibleStorage] load failed', e); }
    })();
  }, []);

  const increaseFontSize = async () => {
    const next = Math.min(fontSizeScale + FONT_STEP, FONT_MAX);
    setFontSizeScale(next);
    await AsyncStorage.setItem(STORAGE_KEYS.fontSize, String(next));
  };

  const decreaseFontSize = async () => {
    const next = Math.max(fontSizeScale - FONT_STEP, FONT_MIN);
    setFontSizeScale(next);
    await AsyncStorage.setItem(STORAGE_KEYS.fontSize, String(next));
  };

  const toggleSaveVerse = async (verseKey, verseData) => {
    const updated = { ...savedVerses };
    if (updated[verseKey]) { delete updated[verseKey]; } else { updated[verseKey] = { ...verseData, timestamp: Date.now() }; }
    setSavedVerses(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.savedVerses, JSON.stringify(updated));
  };

  const saveNote = async (verseKey, noteData, noteText) => {
    const updated = { ...verseNotes };
    if (!noteText.trim()) { delete updated[verseKey]; } else { updated[verseKey] = { ...noteData, note: noteText, timestamp: Date.now() }; }
    setVerseNotes(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.verseNotes, JSON.stringify(updated));
  };

  const removeNote = async (noteKey) => {
    const updated = { ...verseNotes };
    delete updated[noteKey];
    setVerseNotes(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.verseNotes, JSON.stringify(updated));
  };

  const addHighlight = (highlightKey) => {
    setHighlightedVerses((prev) => {
      if (prev.has(highlightKey)) return prev;
      const next = new Set(prev);
      next.add(highlightKey);
      AsyncStorage.setItem(STORAGE_KEYS.highlights, JSON.stringify(Array.from(next)))
        .catch((e) => console.error('[useBibleStorage] highlight persist failed', e));
      return next;
    });
  };

  const removeHighlight = async (highlightKey) => {
    const updated = new Set(highlightedVerses);
    updated.delete(highlightKey);
    setHighlightedVerses(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.highlights, JSON.stringify(Array.from(updated)));
  };

  const toggleUnderline = (underlineKey) => {
    setUnderlinedVerses((prev) => {
      const next = new Set(prev);
      if (next.has(underlineKey)) { next.delete(underlineKey); } else { next.add(underlineKey); }
      AsyncStorage.setItem(STORAGE_KEYS.underlines, JSON.stringify(Array.from(next)))
        .catch((e) => console.error('[useBibleStorage] underline persist failed', e));
      return next;
    });
  };

  return {
    savedVerses, verseNotes, highlightedVerses, underlinedVerses, fontSizeScale,
    increaseFontSize, decreaseFontSize, toggleSaveVerse, saveNote, removeNote,
    addHighlight, removeHighlight, toggleUnderline,
  };
};