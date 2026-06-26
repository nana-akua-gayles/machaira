/**
 * Strips all HTML tags and known text artifacts from raw bolls.life verse text.
 *
 * Handles:
 *   - All HTML tags               <b>, </b>, <sup>, <span ...>, etc.
 *   - Footnote / ref markers      [a], [1], [note]
 *   - Strong's number markers     <S>1234</S>, H1234, G1234 inline refs
 *   - Paragraph markers           ¶
 *   - Non-breaking spaces         \u00a0
 *   - Soft hyphens                \u00ad
 *   - Windows-1252 artifacts      \u0080–\u009f (often appear in KJV)
 *   - Curly quotes → straight     " " ' '
 *   - Multiple whitespace         collapsed to single space
 */
export const cleanVerseText = (rawText) => {
  if (!rawText) return '';
  return rawText
    // Strip all HTML tags (including self-closing and attributes)
    .replace(/<[^>]*>/g, '')
    // Remove footnote / reference markers like [a], [1], [note]
    .replace(/\[[^\]]{0,10}\]/g, '')
    // Remove pilcrow / paragraph signs
    .replace(/¶/g, '')
    // Remove non-breaking spaces and soft hyphens
    .replace(/\u00a0/g, ' ')
    .replace(/\u00ad/g, '')
    // Remove Windows-1252 control characters that appear in some KJV data
    .replace(/[\u0080-\u009f]/g, '')
    // Normalise curly/smart quotes to straight
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    // Collapse all whitespace (tabs, newlines, multiple spaces) to single space
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * AsyncStorage chapter key — "Genesis_Ch1"
 */
export const getChapterKey = (bookName, chapter) =>
  `${bookName}_Ch${chapter}`;

/**
 * Verse-level key used in savedVerses / verseNotes — "Genesis_Ch1_V3"
 */
export const getVerseKey = (bookName, chapter, verse) =>
  `${getChapterKey(bookName, chapter)}_V${verse}`;

/**
 * Highlight set key — "Genesis_1_3"
 */
export const getHighlightKey = (bookName, chapter, verse) =>
  `${bookName}_${chapter}_${verse}`;