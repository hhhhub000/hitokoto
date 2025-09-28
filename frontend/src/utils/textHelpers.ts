/**
 * 日記テキストの有効性をチェックする
 * @param text チェック対象のテキスト
 * @param maxLength 最大文字数（デフォルト: 140）
 * @returns 有効な場合はtrue、無効な場合はfalse
 */
export const validateDiaryText = (text: string, maxLength: number = 140): boolean => {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return false;
  }

  if (trimmedText.length > maxLength) {
    return false;
  }

  return true;
};

/**
 * テキスト装飾のオプション
 */
export interface TextDecorationOptions {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
  fontSize?: string;
}

/**
 * テキストに装飾を適用する
 * @param text 装飾対象のテキスト
 * @param options 装飾オプション
 * @returns 装飾が適用されたHTML文字列
 */
export const formatTextWithDecorations = (text: string, options: TextDecorationOptions): string => {
  let result = text;

  // カラーとフォントサイズのスタイル適用
  if (options.color || options.fontSize) {
    const styles: string[] = [];
    if (options.color) styles.push(`color: ${options.color}`);
    if (options.fontSize) styles.push(`font-size: ${options.fontSize}`);
    result = `<span style="${styles.join('; ')};">${result}</span>`;
  }

  // 取り消し線
  if (options.strikethrough) {
    result = `<s>${result}</s>`;
  }

  // 下線
  if (options.underline) {
    result = `<u>${result}</u>`;
  }

  // 斜体
  if (options.italic) {
    result = `<i>${result}</i>`;
  }

  // 太字
  if (options.bold) {
    result = `<b>${result}</b>`;
  }

  return result;
};

/**
 * 絵文字ショートコードマッピング
 */
const EMOJI_SHORTCODES: Record<string, string> = {
  // 感情
  ':smile:': '😊',
  ':happy:': '😀',
  ':sad:': '😢',
  ':angry:': '😠',
  ':surprised:': '😲',
  ':laugh:': '😂',
  ':cry:': '😭',
  ':love:': '😍',
  ':wink:': '😉',
  ':cool:': '😎',

  // 天気
  ':sun:': '☀️',
  ':sunny:': '☀️',
  ':cloudy:': '☁️',
  ':rain:': '☔',
  ':rainy:': '☔',
  ':snow:': '❄️',
  ':snowy:': '❄️',
  ':thunder:': '⚡',

  // その他
  ':heart:': '❤️',
  ':star:': '⭐',
  ':fire:': '🔥',
  ':wave:': '👋',
  ':thumbsup:': '👍',
  ':thumbsdown:': '👎',
  ':party:': '🎉',
  ':gift:': '🎁',

  // 活動
  ':work:': '💼',
  ':study:': '📚',
  ':sports:': '⚽',
  ':music:': '🎵',
  ':camera:': '📸',
  ':phone:': '📱',
  ':computer:': '💻',
  ':book:': '📖',

  // 食べ物
  ':coffee:': '☕',
  ':cake:': '🍰',
  ':pizza:': '🍕',
  ':apple:': '🍎',
  ':burger:': '🍔',
  ':sushi:': '🍣',
  ':beer:': '🍺',
  ':wine:': '🍷',

  // 乗り物
  ':car:': '🚗',
  ':train:': '🚄',
  ':plane:': '✈️',
  ':bike:': '🚲',
  ':bus:': '🚌',
  ':ship:': '🚢',

  // 自然
  ':flower:': '🌸',
  ':tree:': '🌳',
  ':mountain:': '🏔️',
  ':ocean:': '🌊',
  ':moon:': '🌙',
  ':rainbow:': '🌈'
};

/**
 * 絵文字ショートコードを実際の絵文字に変換する
 * @param text ショートコードを含むテキスト
 * @returns 絵文字に変換されたテキスト
 */
export const parseEmojiShortcodes = (text: string): string => {
  let result = text;

  Object.entries(EMOJI_SHORTCODES).forEach(([shortcode, emoji]) => {
    const regex = new RegExp(escapeRegExp(shortcode), 'g');
    result = result.replace(regex, emoji);
  });

  return result;
};

/**
 * 正規表現用の文字列エスケープ
 * @param string エスケープ対象の文字列
 * @returns エスケープされた文字列
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * HTMLタグを除去して実際の文字数を取得（将来実装予定）
 * @param text HTMLタグを含むテキスト
 * @returns タグを除いた実際の文字数
 */
export const getActualTextLength = (text: string): number => {
  // HTMLタグを除去
  const textWithoutTags = text.replace(/<[^>]*>/g, '');
  return textWithoutTags.length;
};

/**
 * ASCIIアートが含まれているかチェック（将来実装予定）
 * @param text チェック対象のテキスト
 * @returns ASCIIアートが含まれている場合はtrue
 */
export const containsAsciiArt = (text: string): boolean => {
  const asciiArtPatterns = [
    /[٩۶]/g, // ٩(◕‿◕)۶ パターン
    /[⌐■_■]/g, // (⌐■_■) パターン
    /[◕‿◕]/g, // 顔文字パターン
    /[＼(＾o＾)／]/g, // 日本の顔文字
    /[┌∩┐]/g, // テーブル文字
  ];

  return asciiArtPatterns.some(pattern => pattern.test(text));
};

/**
 * MarkdownテキストをHTMLに変換（将来実装予定）
 * @param text Markdownテキスト
 * @returns HTMLに変換されたテキスト
 */
export const parseMarkdown = (text: string): string => {
  let result = text;

  // 太字 **text** → <b>text</b>
  result = result.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

  // 斜体 *text* → <i>text</i>
  result = result.replace(/\*(.*?)\*/g, '<i>$1</i>');

  // 取り消し線 ~~text~~ → <s>text</s>
  result = result.replace(/~~(.*?)~~/g, '<s>$1</s>');

  return result;
};

/**
 * 絵文字の数をカウント
 * @param text テキスト
 * @returns 絵文字の数
 */
export const countEmojis = (text: string): number => {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
};

/**
 * テキスト内容の統計情報を取得
 * @param text 対象テキスト
 * @returns 統計情報オブジェクト
 */
export const getTextStats = (text: string) => {
  return {
    totalLength: text.length,
    actualLength: getActualTextLength(text),
    emojiCount: countEmojis(text),
    hasAsciiArt: containsAsciiArt(text),
    hasDecorations: /<[^>]*>/.test(text)
  };
};