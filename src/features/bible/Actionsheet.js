import React from 'react';
import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { AppText } from '../../components/AppText';
import { Copy, Share2, Bookmark, FileText, X } from 'lucide-react-native';

const ActionSheet = ({
  bookName, chapter, verseNum, verseEnd, isSaved, isHighlighted, isEditingNote, noteText,
  onNoteChange, onClose, onCopy, onShare, onToggleSave, onHighlight, onOpenNote, onSaveNote, onCancelNote,
  bottomOffset = 90,
}) => {
  const isRange = verseEnd && verseEnd !== verseNum;
  const title = isRange ? `${bookName} ${chapter}:${verseNum}–${verseEnd}` : `${bookName} ${chapter}:${verseNum}`;

  return (
    <View style={[styles.actionSheetContainer, { bottom: bottomOffset }]}>
      <View style={styles.actionSheetHeader}>
        <AppText style={styles.actionSheetTitle}>{title}</AppText>
        <Pressable onPress={onClose} hitSlop={8}><X color="#352a48" size={20} /></Pressable>
      </View>

      {!isEditingNote ? (
        <View style={styles.actionButtonsRow}>
          <Pressable onPress={onCopy} style={styles.actionToolButton}>
            <Copy color="#352a48" size={20} /><AppText style={styles.actionToolLabel}>Copy</AppText>
          </Pressable>
          <Pressable onPress={onShare} style={styles.actionToolButton}>
            <Share2 color="#352a48" size={20} /><AppText style={styles.actionToolLabel}>Share</AppText>
          </Pressable>
          <Pressable onPress={onToggleSave} style={styles.actionToolButton}>
            <Bookmark color={isSaved ? '#ef4444' : '#352a48'} fill={isSaved ? '#ef4444' : 'transparent'} size={20} />
            <AppText style={styles.actionToolLabel}>{isSaved ? 'Saved' : 'Save'}</AppText>
          </Pressable>
          <Pressable onPress={onHighlight} style={styles.actionToolButton}>
            <Bookmark color={isHighlighted ? '#f59e0b' : '#352a48'} fill={isHighlighted ? '#f59e0b' : 'transparent'} size={20} />
            <AppText style={styles.actionToolLabel}>Highlight</AppText>
          </Pressable>
          <Pressable onPress={onOpenNote} style={styles.actionToolButton}>
            <FileText color="#352a48" size={20} /><AppText style={styles.actionToolLabel}>Note</AppText>
          </Pressable>
        </View>
      ) : (
        <View style={styles.noteEditorWrapper}>
          <TextInput
            style={styles.noteInputField}
            placeholder="Write your thoughts on this verse..."
            placeholderTextColor="#a1a1aa"
            multiline value={noteText} onChangeText={onNoteChange} autoFocus
          />
          <View style={styles.noteActionButtons}>
            <Pressable onPress={onCancelNote} style={styles.noteCancelButton}><AppText style={styles.noteCancelText}>Back</AppText></Pressable>
            <Pressable onPress={onSaveNote} style={styles.noteSaveButton}><AppText style={styles.noteSaveText}>Save Note</AppText></Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionSheetContainer: {
    position: 'absolute', left: 16, right: 16, backgroundColor: '#ffffff', borderRadius: 24, padding: 20,
    borderWidth: 1.5, borderColor: '#352a48', elevation: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 12, zIndex: 10,
  },
  actionSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f4f4f5', paddingBottom: 10 },
  actionSheetTitle: { fontSize: 16, color: '#352a48', fontWeight: '700' },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 },
  actionToolButton: { alignItems: 'center', justifyContent: 'center', flex: 1, gap: 6 },
  actionToolLabel: { fontSize: 11, color: '#352a48', fontWeight: '500' },
  noteEditorWrapper: { marginTop: 4 },
  noteInputField: { width: '100%', minHeight: 80, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', padding: 12, fontSize: 14, color: '#09090b', textAlignVertical: 'top' },
  noteActionButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 },
  noteCancelButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' },
  noteCancelText: { fontSize: 13, color: '#475569' },
  noteSaveButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#352a48' },
  noteSaveText: { fontSize: 13, color: '#ffffff' },
});

export default ActionSheet;