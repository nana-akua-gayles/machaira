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


export const getChapterKey = (bookName, chapter) =>
  `${bookName}_Ch${chapter}`;

export const getVerseKey = (bookName, chapter, verse) =>
  `${getChapterKey(bookName, chapter)}_V${verse}`;

export const getHighlightKey = (bookName, chapter, verse) =>
  `${bookName}_${chapter}_${verse}`;