/**
 * テキストの有効性をチェックする
 * @param text チェック対象のテキスト
 * @param maxLength 最大文字数（デフォルト: 140）
 * @returns 有効な場合はtrue、無効な場合はfalse
 */
export const isTextValid = (text: string, maxLength: number = 140): boolean => {
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
 * 画像ファイルの有効性をチェックする
 * @param file チェック対象のファイル
 * @returns 有効な場合はtrue、無効な場合はfalse
 */
export const validateImageFile = (file: Express.Multer.File): boolean => {
  if (!file) {
    return false;
  }

  // ファイルサイズチェック（5MB以下）
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return false;
  }

  // MIMEタイプチェック
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return false;
  }

  return true;
};

/**
 * HTML装飾タグを含むテキストから実際の文字数を取得
 * 将来的な実装予定の関数
 * @param text HTML装飾を含むテキスト
 * @returns 装飾タグを除いた実際の文字数
 */
export const getActualTextLength = (text: string): number => {
  // HTMLタグを除去してから文字数を計算
  const textWithoutTags = text.replace(/<[^>]*>/g, '');
  return textWithoutTags.length;
};

/**
 * 装飾付きテキストの有効性をチェック（将来実装予定）
 * @param text 装飾付きテキスト
 * @param maxLength 最大文字数
 * @returns 有効な場合はtrue
 */
export const isDecoratedTextValid = (text: string, maxLength: number = 140): boolean => {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return false;
  }

  // 装飾タグを除いた実際の文字数でチェック
  const actualLength = getActualTextLength(trimmedText);
  if (actualLength > maxLength) {
    return false;
  }

  return true;
};

/**
 * 絵文字の数をカウント
 * @param text テキスト
 * @returns 絵文字の数
 */
export const countEmojis = (text: string): number => {
  // 絵文字の正規表現パターン
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
};

/**
 * ASCIIアートの存在をチェック
 * @param text テキスト
 * @returns ASCIIアートが含まれている場合はtrue
 */
export const containsAsciiArt = (text: string): boolean => {
  // 一般的なASCIIアートパターン
  const asciiArtPatterns = [
    /[٩۶]/g, // ٩(◕‿◕)۶ パターン
    /[⌐■_■]/g, // (⌐■_■) パターン
    /[◕‿◕]/g, // 顔文字パターン
    /[＼(＾o＾)／]/g, // 日本の顔文字
    /[┌∩┐]/g, // テーブル文字
  ];

  return asciiArtPatterns.some(pattern => pattern.test(text));
};