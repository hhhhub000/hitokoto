import { validateImageFile, isTextValid } from '../../utils/helpers';

describe('Text Validation Functions', () => {
  describe('isTextValid', () => {
    test('空文字の場合はfalseを返す', () => {
      expect(isTextValid('')).toBe(false);
      expect(isTextValid('   ')).toBe(false);
    });

    test('140文字以内の有効なテキストの場合はtrueを返す', () => {
      expect(isTextValid('今日は良い天気でした')).toBe(true);
      expect(isTextValid('a'.repeat(140))).toBe(true);
    });

    test('140文字を超える場合はfalseを返す', () => {
      expect(isTextValid('a'.repeat(141))).toBe(false);
    });

    test('カスタム文字数制限が適用される', () => {
      expect(isTextValid('test', 3)).toBe(false);
      expect(isTextValid('test', 4)).toBe(true);
      expect(isTextValid('test', 5)).toBe(true);
    });
  });

  describe('Text Decoration Validation', () => {
    test('HTML装飾タグを含むテキストのバリデーション', () => {
      const textWithBold = '<b>太字テスト</b>';
      const textWithItalic = '<i>斜体テスト</i>';
      const textWithUnderline = '<u>下線テスト</u>';
      const textWithStrike = '<s>取り消し線テスト</s>';
      
      expect(isTextValid(textWithBold)).toBe(true);
      expect(isTextValid(textWithItalic)).toBe(true);
      expect(isTextValid(textWithUnderline)).toBe(true);
      expect(isTextValid(textWithStrike)).toBe(true);
    });

    test('Markdown装飾を含むテキストのバリデーション', () => {
      const textWithMarkdownBold = '**太字テスト**';
      const textWithMarkdownItalic = '*斜体テスト*';
      const textWithMarkdownStrike = '~~取り消し線テスト~~';
      
      expect(isTextValid(textWithMarkdownBold)).toBe(true);
      expect(isTextValid(textWithMarkdownItalic)).toBe(true);
      expect(isTextValid(textWithMarkdownStrike)).toBe(true);
    });

    test('カラー装飾を含むテキストのバリデーション', () => {
      const textWithColor = '<span style="color: red;">赤色テスト</span>';
      expect(isTextValid(textWithColor)).toBe(true);
    });

    test('フォントサイズ装飾を含むテキストのバリデーション', () => {
      const textWithSize = '<span style="font-size: large;">大きい文字</span>';
      expect(isTextValid(textWithSize)).toBe(true);
    });
  });

  describe('Emoji and ASCII Art Validation', () => {
    test('絵文字を含むテキストのバリデーション', () => {
      const textWithEmoji = '今日は楽しかった😀😃😄';
      const textWithMultipleEmojis = '晴れ☀️のち雨☔時々曇り☁️';
      
      expect(isTextValid(textWithEmoji)).toBe(true);
      expect(isTextValid(textWithMultipleEmojis)).toBe(true);
    });

    test('アスキーアートを含むテキストのバリデーション', () => {
      const textWithAsciiArt = '今日は嬉しい ٩(◕‿◕)۶';
      const textWithComplexAscii = 'クール (⌐■_■) な一日でした';
      
      expect(isTextValid(textWithAsciiArt)).toBe(true);
      expect(isTextValid(textWithComplexAscii)).toBe(true);
    });

    test('複合装飾（絵文字＋HTML装飾）のバリデーション', () => {
      const complexText = '<b>今日は</b>とても<i>楽しかった</i>😀🎉';
      expect(isTextValid(complexText)).toBe(true);
    });
  });

  describe('Character Limit with Decorations', () => {
    test('装飾タグを含めて140文字以内の場合', () => {
      const decoratedText = '<b>' + 'a'.repeat(135) + '</b>'; // <b></b> = 7文字 + 135文字 = 142文字
      expect(decoratedText.length).toBe(142);
      expect(isTextValid(decoratedText)).toBe(false);
    });

    test('装飾タグを除いた実際の文字数での制限チェック', () => {
      // この関数は将来的に実装予定：装飾タグを除いた文字数でのバリデーション
      const decoratedText = '<b>' + 'a'.repeat(140) + '</b>';
      // 現在の実装では全体の文字数でチェックされるが、
      // 将来的には装飾タグを除いた文字数（140文字）でチェックする予定
      expect(decoratedText.length).toBeGreaterThan(140);
    });
  });
});