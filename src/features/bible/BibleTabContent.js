import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Pressable, Share } from 'react-native';
import { AppText } from '../../components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { ChevronLeft, ChevronRight, Bookmark, FileText, Trash2, ChevronDown } from 'lucide-react-native';

import { POPULAR_TRANSLATIONS, BIBLE_BOOKS } from './Bibledata';
import { FONT_MIN, FONT_MAX } from './Constants';
import { cleanVerseText, getChapterKey, getVerseKey, getHighlightKey } from './Utils';
import { useBibleStorage } from './Usebiblestorage';
import { useBibleData } from './Usebibledata';
import { useVerseScroll } from './Useversescroll';
import VerseRow from './Verserow';
import ActionSheet from './Actionsheet';
import ChapterVersePicker from './Chapterversepicker';
import BooksView from './Booksview';

export const BibleTabContent = ({ tabBarHeight = 60 }) => {
  const [activeTab, setActiveTab] = useState('books');
  const [activeVersion, setActiveVersion] = useState('KJV');
  const [activeBook, setActiveBook] = useState({ id: 1, name: 'Genesis', chapters: 50 });
  const [activeChapter, setActiveChapter] = useState(1);
  const [selectedBookForChapters, setSelectedBookForChapters] = useState(null);
  const [selectedChapterForVerses, setSelectedChapterForVerses] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [navHighlightKey, setNavHighlightKey] = useState(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerStep, setPickerStep] = useState('chapters');
  const [tempSelectedChapter, setTempSelectedChapter] = useState(null);

  const storage = useBibleStorage();

  const { verses, loading, error, wizardVerses, wizardVersesLoading, fetchScripture, fetchWizardChapterVerseCount, resetWizardVerses } = useBibleData(activeVersion);

  const { scrollRef, versePositionsRef, pendingScrollVerseRef, lastReadVerseRef, handleVerseLayout, scrollToVerseIfReady, handleScrollPositionChange } = useVerseScroll(setNavHighlightKey);

  const scrollToTop = useCallback(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 0, animated: false }));
  }, [scrollRef]);

  const clearNavHighlight = useCallback(() => setNavHighlightKey(null), []);

  useFocusEffect(useCallback(() => {
    setActiveTab('books');
    setSelectedBookForChapters(null);
    setSelectedChapterForVerses(null);
    setSearchQuery('');
  }, []));

  useEffect(() => {
    if (activeTab !== 'read') return;
    fetchScripture({
      bookId: activeBook.id, chapter: activeChapter, bookName: activeBook.name,
      versePositionsRef, pendingScrollVerseRef, clearNavHighlight, onScrollToTop: scrollToTop,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activeBook.id, activeBook.name, activeChapter, activeVersion, fetchScripture, clearNavHighlight, scrollToTop]);

  const chapterKey = getChapterKey(activeBook.name, activeChapter);

  const filteredBooks = Array.isArray(BIBLE_BOOKS)
    ? BIBLE_BOOKS.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  const dynamicLineHeight = storage.fontSizeScale * 1.45;
  const dynamicVerseSpacing = storage.fontSizeScale * 0.35;
  const activeBookFull = BIBLE_BOOKS.find((b) => b.id === activeBook.id) ?? { ...activeBook, chapters: 50 };
  const isInsideSelectionWizard = activeTab === 'books' && selectedBookForChapters !== null;
  const floatingNavBottom = tabBarHeight + 12;

  const resetSelectionWizard = useCallback(() => {
    setSelectedBookForChapters(null); setSelectedChapterForVerses(null); resetWizardVerses();
  }, [resetWizardVerses]);

  const closeSheet = () => { setIsSheetOpen(false); setIsEditingNote(false); };
  const clearSelection = () => { setSelectedVerse(null); closeSheet(); };

  const getSelectedVerseTextString = () => {
    const found = verses.find((v) => v.verse === selectedVerse);
    return found ? cleanVerseText(found.text) : '';
  };

  const getCurrentBookChapters = useCallback((bookId) => {
    const b = BIBLE_BOOKS.find((b) => b.id === bookId);
    return b?.chapters ?? 50;
  }, []);

  const handleNextChapter = () => {
    clearSelection(); setNavHighlightKey(null);
    const total = getCurrentBookChapters(activeBook.id);
    if (activeChapter < total) {
      setActiveChapter((prev) => prev + 1);
    } else {
      const idx = BIBLE_BOOKS.findIndex((b) => b.id === activeBook.id);
      if (idx !== -1 && idx < BIBLE_BOOKS.length - 1) {
        const next = BIBLE_BOOKS[idx + 1];
        setActiveBook({ id: next.id, name: next.name, chapters: next.chapters });
        setActiveChapter(1);
      }
    }
  };

  const handlePrevChapter = () => {
    clearSelection(); setNavHighlightKey(null);
    if (activeChapter > 1) {
      setActiveChapter((prev) => prev - 1);
    } else {
      const idx = BIBLE_BOOKS.findIndex((b) => b.id === activeBook.id);
      if (idx > 0) {
        const prevBook = BIBLE_BOOKS[idx - 1];
        setActiveBook({ id: prevBook.id, name: prevBook.name, chapters: prevBook.chapters });
        setActiveChapter(prevBook.chapters || 1);
      }
    }
  };

  const handleVerseTap = () => {
  if (isSheetOpen) { closeSheet(); return; }
  if (navHighlightKey !== null) { setNavHighlightKey(null); return; }
};

  // Long press — select verse AND open sheet
  const handleVerseLongPress = (verseNum) => {
    setIsEditingNote(false);
    if (selectedVerse === verseNum && isSheetOpen) { clearSelection(); return; }
    setNavHighlightKey(null);
    setSelectedVerse(verseNum);
    setIsSheetOpen(true);
    const key = getVerseKey(activeBook.name, activeChapter, verseNum);
    setNoteText(storage.verseNotes[key]?.note ?? '');
  };

  const handleCopyVerse = async () => {
    const text = getSelectedVerseTextString();
    if (!text) return;
    await Clipboard.setStringAsync(`"${text}" — ${activeBook.name} ${activeChapter}:${selectedVerse} (${activeVersion})`);
    clearSelection();
  };

  const handleShareVerse = async () => {
    const text = getSelectedVerseTextString();
    if (!text) return;
    try { await Share.share({ message: `"${text}"\n\n— ${activeBook.name} ${activeChapter}:${selectedVerse} (${activeVersion})` }); }
    catch (e) { console.error(e); }
    clearSelection();
  };

  const handleToggleSaveVerse = () => {
    const key = getVerseKey(activeBook.name, activeChapter, selectedVerse);
    storage.toggleSaveVerse(key, { book: activeBook.name, chapter: activeChapter, verse: selectedVerse, text: getSelectedVerseTextString(), version: activeVersion });
    clearSelection();
  };

  const handleHighlightVerse = () => {
    storage.addHighlight(getHighlightKey(activeBook.name, activeChapter, selectedVerse));
    clearSelection();
  };

  const handleSaveNote = () => {
    const key = getVerseKey(activeBook.name, activeChapter, selectedVerse);
    storage.saveNote(key, { book: activeBook.name, chapter: activeChapter, verse: selectedVerse }, noteText);
    clearSelection();
  };

  const handlePickerSelectChapter = (chapNum) => {
    setTempSelectedChapter(chapNum); setActiveChapter(chapNum); setPickerStep('verses');
  };

  // Navigate to verse — highlight only, no sheet
  const handlePickerSelectVerse = (verseNum) => {
    setIsPickerOpen(false);
    setSelectedVerse(verseNum);
    setIsSheetOpen(false);
    setNavHighlightKey(getHighlightKey(activeBook.name, tempSelectedChapter || activeChapter, verseNum));
    scrollToVerseIfReady(verseNum);
  };

  const handleBooksSelectChapter = (chapNum) => {
    setSelectedChapterForVerses(chapNum);
    fetchWizardChapterVerseCount(selectedBookForChapters.id, chapNum, selectedBookForChapters.name);
  };

  // Navigate to verse — highlight only, no sheet
  const handleBooksSelectVerse = (verseNum) => {
    const book = selectedBookForChapters;
    const chapter = selectedChapterForVerses;
    setNavHighlightKey(getHighlightKey(book.name, chapter, verseNum));
    setActiveBook({ id: book.id, name: book.name, chapters: book.chapters });
    setActiveChapter(chapter);
    setSelectedVerse(verseNum);
    setIsSheetOpen(false);
    pendingScrollVerseRef.current = verseNum;
    resetSelectionWizard();
    setActiveTab('read');
  };

  const handleRetry = useCallback(() => {
    fetchScripture({
      bookId: activeBook.id, chapter: activeChapter, bookName: activeBook.name,
      versePositionsRef, pendingScrollVerseRef, clearNavHighlight, onScrollToTop: scrollToTop,
    });
  }, [activeBook.id, activeBook.name, activeChapter, fetchScripture, versePositionsRef, pendingScrollVerseRef, clearNavHighlight, scrollToTop]);

  return (
    <SafeAreaView style={styles.appContainer} edges={['top', 'left', 'right']}>

      {!isInsideSelectionWizard && (
        <View style={styles.topControlHeader}>
          {activeTab === 'read' ? (
            <>
              <Pressable onPress={() => { setActiveTab('books'); resetSelectionWizard(); }} style={styles.bookSelectorLink}>
                <AppText style={styles.mainDisplayTitle}>{activeBook.name} {activeChapter}</AppText>
              </Pressable>
              <View style={styles.headerRightSettingsRow}>
                <View style={styles.fontPillContainer}>
                  <Pressable onPress={storage.decreaseFontSize} disabled={storage.fontSizeScale <= FONT_MIN} style={styles.fontPillBtn} hitSlop={8}>
                    <AppText style={[styles.fontPillText, storage.fontSizeScale <= FONT_MIN && styles.disabledPillText]}>A-</AppText>
                  </Pressable>
                  <View style={styles.fontPillDivider} />
                  <Pressable onPress={storage.increaseFontSize} disabled={storage.fontSizeScale >= FONT_MAX} style={styles.fontPillBtn} hitSlop={8}>
                    <AppText style={[styles.fontPillText, storage.fontSizeScale >= FONT_MAX && styles.disabledPillText]}>A+</AppText>
                  </Pressable>
                </View>
                <Pressable onPress={() => setActiveTab('versions')} style={styles.versionPillTab}>
                  <AppText style={styles.versionPillText}>{activeVersion}</AppText>
                  <ChevronDown size={10} color="#ffffff" style={styles.versionPillChevron} />
                </Pressable>
              </View>
            </>
          ) : activeTab === 'versions' ? (
            <Pressable onPress={() => setActiveTab('read')} style={styles.backFromVersionsRow}>
              <ChevronLeft size={22} color="#352a48" style={styles.backFromVersionsChevron} />
              <AppText style={styles.mainDisplayTitle}>Back</AppText>
            </Pressable>
          ) : (
            <>
              <View style={styles.metaBreadcrumbRow}>
                <AppText style={styles.mainDisplayTitle}>Bible</AppText>
              </View>
              <View style={styles.headerActionButtonGroup}>
                <Pressable onPress={() => setActiveTab(activeTab === 'notes' ? 'books' : 'notes')} style={[styles.premiumWorkspaceTab, activeTab === 'notes' && styles.premiumWorkspaceTabActive]}>
                  <FileText size={13} color={activeTab === 'notes' ? '#ffffff' : '#352a48'} style={styles.tabIcon} />
                  <AppText style={[styles.premiumTabLabel, activeTab === 'notes' && styles.premiumTabLabelActive]}>Notes</AppText>
                </Pressable>
                <Pressable onPress={() => setActiveTab(activeTab === 'highlights' ? 'books' : 'highlights')} style={[styles.premiumWorkspaceTab, activeTab === 'highlights' && styles.premiumWorkspaceTabActive]}>
                  <Bookmark size={13} color={activeTab === 'highlights' ? '#ffffff' : '#352a48'} fill={activeTab === 'highlights' ? '#ffffff' : 'transparent'} style={styles.tabIcon} />
                  <AppText style={[styles.premiumTabLabel, activeTab === 'highlights' && styles.premiumTabLabelActive]}>Highlighted</AppText>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}

      {!isInsideSelectionWizard && <View style={styles.headerUnderlineWidth} />}

      <View style={styles.centralModuleWorkspace}>

        {activeTab === 'read' && (
          <View style={styles.flex1}>
            {loading ? (
              <View style={styles.loadingWrapperPane}>
                <ActivityIndicator size="small" color="#352a48" />
                <AppText style={styles.loadingIndicatorSubtitle}>Loading Scripture...</AppText>
              </View>
            ) : error ? (
              <View style={styles.loadingWrapperPane}>
                <AppText style={styles.networkErrorTitle}>Translation Offline</AppText>
                <AppText style={styles.networkErrorBodyText}>{error}</AppText>
                <Pressable onPress={handleRetry} style={styles.rectRetryButton}>
                  <AppText style={styles.rectRetryButtonLabel}>Reload</AppText>
                </Pressable>
              </View>
            ) : (
              <ScrollView
                ref={scrollRef}
                key={`${activeBook?.id || activeBook}_ch${activeChapter}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.textCanvasLayoutPadding}
                onScroll={(e) => handleScrollPositionChange(e.nativeEvent.contentOffset.y)}
                scrollEventThrottle={100}
              >
                <View style={styles.editorialParagraphBlock}>
                  {verses.map((v) => {
                    const verseStringKey = getHighlightKey(activeBook.name, activeChapter, v.verse);
                    const noteKey = getVerseKey(activeBook.name, activeChapter, v.verse);
                    return (
                      <VerseRow
                          key={v.pk}
                          v={v}
                          isSelected={selectedVerse === v.verse}
                          isNavHighlight={navHighlightKey === verseStringKey}
                          isHighlighted={storage.highlightedVerses.has(verseStringKey)}
                          isUnderlined={storage.underlinedVerses.has(noteKey)}
                          hasNote={!!storage.verseNotes[noteKey]}
                          isSaved={!!storage.savedVerses[noteKey]}
                          fontSizeScale={storage.fontSizeScale}
                          dynamicLineHeight={dynamicLineHeight}
                          dynamicVerseSpacing={dynamicVerseSpacing}
                          onPress={() => storage.toggleUnderline(noteKey)}
                          onLongPress={() => handleVerseLongPress(v.verse)}
                          onLayout={(e) => handleVerseLayout(v.verse, e.nativeEvent.layout.y)}
                        />
                    );
                  })}
                </View>
                <View style={[styles.scrollBottomSpacer, { height: floatingNavBottom + 140 }]} />
              </ScrollView>
            )}

            {/* Action sheet — only when explicitly opened via long press */}
            {selectedVerse && isSheetOpen && !isPickerOpen && (
              <ActionSheet
                bookName={activeBook.name}
                chapter={activeChapter}
                verseNum={selectedVerse}
                isSaved={!!storage.savedVerses[getVerseKey(activeBook.name, activeChapter, selectedVerse)]}
                isHighlighted={storage.highlightedVerses.has(getHighlightKey(activeBook.name, activeChapter, selectedVerse))}
                isEditingNote={isEditingNote}
                noteText={noteText}
                onNoteChange={setNoteText}
                onClose={clearSelection}
                onCopy={handleCopyVerse}
                onShare={handleShareVerse}
                onToggleSave={handleToggleSaveVerse}
                onHighlight={handleHighlightVerse}
                onOpenNote={() => setIsEditingNote(true)}
                onSaveNote={handleSaveNote}
                onCancelNote={() => setIsEditingNote(false)}
                bottomOffset={floatingNavBottom + 68}
              />
            )}

            <View style={[styles.floatingTurnPageRow, { bottom: floatingNavBottom }]}>
              <Pressable onPress={handlePrevChapter} style={styles.turnPageCircleActionBtn}>
                <ChevronLeft color="#352a48" size={20} strokeWidth={2.5} />
              </Pressable>
              <Pressable onPress={() => { setPickerStep('chapters'); setIsPickerOpen(!isPickerOpen); }} style={styles.centerReaderPillLink}>
                <AppText style={styles.centerReaderPillText}>Chapter {activeChapter}</AppText>
                <ChevronDown color="#352a48" size={13} style={styles.centerReaderChevron} />
              </Pressable>
              <Pressable onPress={handleNextChapter} style={styles.turnPageCircleActionBtn}>
                <ChevronRight color="#352a48" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            <ChapterVersePicker
              isOpen={isPickerOpen}
              bookName={activeBook.name}
              bookChapterCount={activeBookFull?.chapters || 50}
              activeChapter={activeChapter}
              pickerStep={pickerStep}
              tempSelectedChapter={tempSelectedChapter}
              verseCount={verses?.length > 0 ? verses.length : wizardVerses?.length > 0 ? wizardVerses.length : 30}
              onClose={() => setIsPickerOpen(false)}
              onSelectChapter={handlePickerSelectChapter}
              onSelectVerse={handlePickerSelectVerse}
              onBackToChapters={() => setPickerStep('chapters')}
              tabBarHeight={tabBarHeight}
            />
          </View>
        )}

        {activeTab === 'books' && (
          <BooksView
            filteredBooks={filteredBooks}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchClear={() => setSearchQuery('')}
            selectedBook={selectedBookForChapters}
            selectedChapter={selectedChapterForVerses}
            wizardVerses={wizardVerses}
            wizardVersesLoading={wizardVersesLoading}
            onSelectBook={(bookItem) => { setSearchQuery(''); setSelectedBookForChapters(bookItem); }}
            onSelectChapter={handleBooksSelectChapter}
            onSelectVerse={handleBooksSelectVerse}
            onBackFromChapters={() => setSelectedBookForChapters(null)}
            onBackFromVerses={() => setSelectedChapterForVerses(null)}
            tabBarHeight={tabBarHeight}
          />
        )}

        {activeTab === 'versions' && (
          <View style={styles.flex1}>
            <ScrollView contentContainerStyle={styles.versionsScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.versionsTitleBlock}>
                <AppText style={styles.versionsTitleText}>Translations</AppText>
                <AppText style={styles.versionsSubtitleText}>Select your preferred Bible translation</AppText>
              </View>
              <View style={styles.translationsList}>
                {POPULAR_TRANSLATIONS.map((translation) => (
                  <Pressable
                    key={translation.code}
                    style={[styles.archiveNoteDataCard, activeVersion === translation.code && styles.activeTranslationCard]}
                    onPress={() => {
                      if (lastReadVerseRef.current) pendingScrollVerseRef.current = lastReadVerseRef.current;
                      setActiveVersion(translation.code);
                      setActiveTab('read');
                    }}
                  >
                    <AppText style={styles.translationCode}>{translation.code}</AppText>
                    <AppText style={styles.translationLabel}>{translation.label}</AppText>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {activeTab === 'notes' && (
          <ScrollView contentContainerStyle={styles.userDashboardArchiveScroll} showsVerticalScrollIndicator={false}>
            <AppText style={styles.dashboardViewMainHeader}>My Notes</AppText>
            {Object.keys(storage.verseNotes).length === 0 ? (
              <AppText style={styles.emptyDashboardStatusText}>No notes yet. Long press a verse while reading to add one.</AppText>
            ) : (
              Object.entries(storage.verseNotes).map(([noteKey, noteData]) => (
                <View key={noteKey} style={styles.archiveNoteDataCard}>
                  <View style={styles.archiveCardMetaHeader}>
                    <AppText style={styles.archiveCardVerseTitle}>{noteData.book} {noteData.chapter}:{noteData.verse}</AppText>
                    <Pressable onPress={() => storage.removeNote(noteKey)}><Trash2 color="#ef4444" size={16} /></Pressable>
                  </View>
                  <AppText style={styles.archiveCardBodyContent}>{noteData.note}</AppText>
                  <AppText style={styles.noteTimestamp}>{new Date(noteData.timestamp).toLocaleDateString()}</AppText>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {activeTab === 'highlights' && (
          <ScrollView contentContainerStyle={styles.userDashboardArchiveScroll} showsVerticalScrollIndicator={false}>
            <AppText style={styles.dashboardViewMainHeader}>Highlighted Verses</AppText>
            {storage.highlightedVerses.size === 0 ? (
              <AppText style={styles.emptyDashboardStatusText}>No highlighted verses yet.</AppText>
            ) : (
              Array.from(storage.highlightedVerses).map((highlightKey) => {
                const [book, chapter, verse] = highlightKey.split('_');
                return (
                  <View key={highlightKey} style={styles.archiveHighlightDataCard}>
                    <View style={styles.archiveCardMetaHeader}>
                      <AppText style={styles.archiveCardVerseTitle}>{book} {chapter}:{verse}</AppText>
                      <Pressable onPress={() => storage.removeHighlight(highlightKey)}><Trash2 color="#ef4444" size={16} /></Pressable>
                    </View>
                    <AppText style={[styles.archiveCardBodyContent, styles.italicText]}>Verse highlighted during personal reading.</AppText>
                  </View>
                );
              })
            )}
          </ScrollView>
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  italicText: { fontStyle: 'italic' },
  tabIcon: { marginRight: 4 },
  scrollBottomSpacer: { height: 180 },
  centerReaderChevron: { marginLeft: 4 },
  backFromVersionsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  backFromVersionsChevron: { marginLeft: -4 },
  appContainer: { flex: 1, backgroundColor: '#ffffff' },
  topControlHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6, backgroundColor: '#ffffff' },
  mainDisplayTitle: { fontSize: 21, color: '#352a48', letterSpacing: -0.5 },
  headerActionButtonGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaBreadcrumbRow: {},
  premiumWorkspaceTab: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 10, height: 34, justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  premiumWorkspaceTabActive: { backgroundColor: '#352a48', borderColor: '#352a48' },
  premiumTabLabel: { fontSize: 12, color: '#352a48' },
  premiumTabLabelActive: { color: '#ffffff' },
  headerUnderlineWidth: { height: 1, backgroundColor: '#f1f5f9', width: '100%' },
  centralModuleWorkspace: { flex: 1, backgroundColor: '#ffffff' },
  textCanvasLayoutPadding: { paddingHorizontal: 24, paddingTop: 0 },
  editorialParagraphBlock: { width: '100%' },
  bookSelectorLink: { paddingVertical: 4 },
  headerRightSettingsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fontPillContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#6b7280', borderRadius: 20, paddingHorizontal: 12, height: 36 },
  fontPillBtn: { paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' },
  fontPillText: { fontSize: 13, fontWeight: '600', color: '#000000' },
  disabledPillText: { color: '#cbd5e1' },
  fontPillDivider: { width: 1, height: 16, backgroundColor: '#6b7280', marginHorizontal: 8 },
  versionPillTab: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e2541', borderRadius: 20, paddingHorizontal: 14, height: 36 },
  versionPillText: { fontSize: 12, color: '#ffffff', letterSpacing: 0.5 },
  versionPillChevron: { marginLeft: 4, marginTop: 1 },
  floatingTurnPageRow: { position: 'absolute', left: 16, right: 16, height: 56, backgroundColor: '#352a48', borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, elevation: 12, zIndex: 5 },
  turnPageCircleActionBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  centerReaderPillLink: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, height: 42, borderRadius: 21, backgroundColor: '#ffffff' },
  centerReaderPillText: { fontSize: 13, color: '#352a48' },
  loadingWrapperPane: { flex: 0.8, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 32 },
  loadingIndicatorSubtitle: { fontSize: 12, color: '#352a48' },
  networkErrorTitle: { fontSize: 16, color: '#09090b', textAlign: 'center', marginBottom: 6 },
  networkErrorBodyText: { fontSize: 13, color: '#352a48', textAlign: 'center', lineHeight: 20 },
  rectRetryButton: { backgroundColor: '#352a48', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  rectRetryButtonLabel: { color: '#ffffff', fontSize: 12 },
  versionsScroll: { paddingHorizontal: 16, paddingBottom: 100 },
  versionsTitleBlock: { paddingVertical: 14 },
  versionsTitleText: { fontSize: 22, color: '#352a48', marginBottom: 4, fontWeight: '700' },
  versionsSubtitleText: { color: '#64748b', fontSize: 14 },
  translationsList: { marginTop: 8, gap: 10 },
  activeTranslationCard: { borderLeftWidth: 4, borderLeftColor: '#352a48', backgroundColor: '#f5f3ff' },
  translationCode: { color: '#352a48', fontSize: 16, fontWeight: '700' },
  translationLabel: { color: '#64748b', fontSize: 12, marginTop: 2 },
  userDashboardArchiveScroll: { padding: 24, paddingBottom: 100 },
  dashboardViewMainHeader: { fontSize: 20, color: '#09090b', marginBottom: 16 },
  emptyDashboardStatusText: { fontSize: 14, color: '#a1a1aa', textAlign: 'center', marginTop: 40 },
  noteTimestamp: { fontSize: 11, color: '#94a3b8', marginTop: 6 },
  archiveNoteDataCard: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#352a48', marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  archiveHighlightDataCard: { backgroundColor: '#fffde7', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#fef08a', marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  archiveCardMetaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  archiveCardVerseTitle: { fontSize: 14, color: '#09090b' },
  archiveCardBodyContent: { fontSize: 13, color: '#352a48', lineHeight: 18 },
});