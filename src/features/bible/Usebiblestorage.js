import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabaseClient';
import { FONT_DEFAULT, FONT_MIN, FONT_MAX, FONT_STEP, STORAGE_KEYS } from './Constants';

export const Usebiblestorage = () => {
  const [savedVerses, setSavedVerses] = useState({});
  const [verseNotes, setVerseNotes] = useState({});
  const [fontSizeScale, setFontSizeScale] = useState(FONT_DEFAULT);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const [storedNotes, storedFont] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.verseNotes),
        AsyncStorage.getItem(STORAGE_KEYS.fontSize),
      ]);
      if (storedNotes) setVerseNotes(JSON.parse(storedNotes));
      if (storedFont) setFontSizeScale(Number(storedFont));
      
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      fetchSavedVerses(session?.user ?? null);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      fetchSavedVerses(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchSavedVerses = async (currentUser) => {
    if (currentUser) {
      const { data, error } = await supabase
        .from('saved_verses')
        .select('*')
        .eq('user_id', currentUser.id);
      
      if (error) {
        console.error("Error fetching verses:", error);
        return;
      }
      
      const formatted = (data || []).reduce((acc, curr) => {
        acc[`${curr.book}_${curr.chapter}_${curr.verse}`] = curr;
        return acc;
      }, {});
      setSavedVerses(formatted);
    } else {
      const local = await AsyncStorage.getItem(STORAGE_KEYS.savedVerses);
      setSavedVerses(local ? JSON.parse(local) : {});
    }
  };

  const toggleSave = async (verseObj) => {
    const { book, chapter, verse, text } = verseObj;
    const key = `${book}_${chapter}_${verse}`;

    if (user) {
      const { data: existing } = await supabase
        .from('saved_verses')
        .select('id')
        .eq('user_id', user.id)
        .eq('book', book)
        .eq('chapter', chapter)
        .eq('verse', verse);

      if (existing && existing.length > 0) {
        await supabase.from('saved_verses').delete().eq('id', existing[0].id);
      } else {
        await supabase.from('saved_verses').insert([{ user_id: user.id, book, chapter, verse, text }]);
      }
      fetchSavedVerses(user);
    } else {
      const current = { ...savedVerses };
      if (current[key]) delete current[key];
      else current[key] = verseObj;
      setSavedVerses(current);
      await AsyncStorage.setItem(STORAGE_KEYS.savedVerses, JSON.stringify(current));
    }
  };

  // Added this method to specifically handle deletions from the Saved tab
  const deleteSavedVerse = async (saveKey, saveData) => {
    if (user) {
      await supabase
        .from('saved_verses')
        .delete()
        .eq('user_id', user.id)
        .eq('book', saveData.book)
        .eq('chapter', saveData.chapter)
        .eq('verse', saveData.verse);
      fetchSavedVerses(user);
    } else {
      const current = { ...savedVerses };
      delete current[saveKey];
      setSavedVerses(current);
      await AsyncStorage.setItem(STORAGE_KEYS.savedVerses, JSON.stringify(current));
    }
  };

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

  const saveNote = async (verseKey, noteData, noteText) => {
    setVerseNotes((prev) => {
      const updated = { ...prev };
      if (!noteText.trim()) delete updated[verseKey];
      else updated[verseKey] = { ...noteData, note: noteText, timestamp: Date.now() };
      AsyncStorage.setItem(STORAGE_KEYS.verseNotes, JSON.stringify(updated));
      return updated;
    });
  };

  const removeNote = async (noteKey) => {
    setVerseNotes((prev) => {
      const updated = { ...prev };
      delete updated[noteKey];
      AsyncStorage.setItem(STORAGE_KEYS.verseNotes, JSON.stringify(updated));
      return updated;
    });
  };

  return { 
    savedVerses, 
    verseNotes, 
    fontSizeScale, 
    user, 
    toggleSave,
    deleteSavedVerse, // Exported new function
    saveNote, 
    removeNote, 
    increaseFontSize, 
    decreaseFontSize 
  };
};