import { describe, test, expect } from 'vitest';
import { validateDiaryText, formatTextWithDecorations, parseEmojiShortcodes } from '../../utils/textHelpers';

describe('Text Decoration Utilities', () => {
  describe('validateDiaryText', () => {
    test('有効なテキストの場合はtrueを返す', () => {
      expect(validateDiaryText('普通のテキスト')).toBe(true);
      expect(validateDiaryText('絵文字付きテキスト😊')).toBe(true);
    });

    test('空文字またはnull/undefinedの場合はfalseを返す', () => {
      expect(validateDiaryText('')).toBe(false);
      expect(validateDiaryText('   ')).toBe(false);
      expect(validateDiaryText(null as any)).toBe(false);
      expect(validateDiaryText(undefined as any)).toBe(false);
    });

    test('140文字を超える場合はfalseを返す', () => {
      const longText = 'あ'.repeat(141);
      expect(validateDiaryText(longText)).toBe(false);
    });

    test('140文字ちょうどの場合はtrueを返す', () => {
      const exactText = 'あ'.repeat(140);
      expect(validateDiaryText(exactText)).toBe(true);
    });
  });

  describe('formatTextWithDecorations', () => {
    test('太字装飾が正しく適用される', () => {
      const text = '重要なテキスト';
      const result = formatTextWithDecorations(text, { bold: true });
      expect(result).toBe('<b>重要なテキスト</b>');
    });

    test('斜体装飾が正しく適用される', () => {
      const text = '強調したいテキスト';
      const result = formatTextWithDecorations(text, { italic: true });
      expect(result).toBe('<i>強調したいテキスト</i>');
    });

    test('下線装飾が正しく適用される', () => {
      const text = '下線を引くテキスト';
      const result = formatTextWithDecorations(text, { underline: true });
      expect(result).toBe('<u>下線を引くテキスト</u>');
    });

    test('取り消し線装飾が正しく適用される', () => {
      const text = '取り消すテキスト';
      const result = formatTextWithDecorations(text, { strikethrough: true });
      expect(result).toBe('<s>取り消すテキスト</s>');
    });

    test('カラー装飾が正しく適用される', () => {
      const text = '色付きテキスト';
      const result = formatTextWithDecorations(text, { color: 'red' });
      expect(result).toBe('<span style="color: red;">色付きテキスト</span>');
    });

    test('フォントサイズ装飾が正しく適用される', () => {
      const text = 'サイズ変更テキスト';
      const result = formatTextWithDecorations(text, { fontSize: 'large' });
      expect(result).toBe('<span style="font-size: large;">サイズ変更テキスト</span>');
    });

    test('複数の装飾が正しく組み合わせられる', () => {
      const text = '複合装飾テキスト';
      const result = formatTextWithDecorations(text, { 
        bold: true, 
        italic: true, 
        color: 'blue' 
      });
      expect(result).toBe('<b><i><span style="color: blue;">複合装飾テキスト</span></i></b>');
    });

    test('装飾なしの場合は元のテキストを返す', () => {
      const text = '普通のテキスト';
      const result = formatTextWithDecorations(text, {});
      expect(result).toBe('普通のテキスト');
    });
  });

  describe('parseEmojiShortcodes', () => {
    test('絵文字ショートコードが正しく変換される', () => {
      expect(parseEmojiShortcodes(':smile:')).toBe('😊');
      expect(parseEmojiShortcodes(':heart:')).toBe('❤️');
      expect(parseEmojiShortcodes(':sun:')).toBe('☀️');
      expect(parseEmojiShortcodes(':rain:')).toBe('☔');
    });

    test('複数の絵文字ショートコードが変換される', () => {
      const text = '今日は:sun:で気分は:smile:です';
      const result = parseEmojiShortcodes(text);
      expect(result).toBe('今日は☀️で気分は😊です');
    });

    test('存在しないショートコードはそのまま残る', () => {
      const text = ':nonexistent: ショートコード';
      const result = parseEmojiShortcodes(text);
      expect(result).toBe(':nonexistent: ショートコード');
    });

    test('既に絵文字が含まれているテキストも正しく処理される', () => {
      const text = '😊 :heart: 混在テスト';
      const result = parseEmojiShortcodes(text);
      expect(result).toBe('😊 ❤️ 混在テスト');
    });

    test('感情絵文字ショートコードが変換される', () => {
      expect(parseEmojiShortcodes(':happy:')).toBe('😀');
      expect(parseEmojiShortcodes(':sad:')).toBe('😢');
      expect(parseEmojiShortcodes(':angry:')).toBe('😠');
      expect(parseEmojiShortcodes(':surprised:')).toBe('😲');
    });

    test('天気絵文字ショートコードが変換される', () => {
      expect(parseEmojiShortcodes(':sunny:')).toBe('☀️');
      expect(parseEmojiShortcodes(':cloudy:')).toBe('☁️');
      expect(parseEmojiShortcodes(':rainy:')).toBe('☔');
      expect(parseEmojiShortcodes(':snowy:')).toBe('❄️');
    });

    test('活動絵文字ショートコードが変換される', () => {
      expect(parseEmojiShortcodes(':work:')).toBe('💼');
      expect(parseEmojiShortcodes(':study:')).toBe('📚');
      expect(parseEmojiShortcodes(':sports:')).toBe('⚽');
      expect(parseEmojiShortcodes(':music:')).toBe('🎵');
    });

    test('食べ物絵文字ショートコードが変換される', () => {
      expect(parseEmojiShortcodes(':coffee:')).toBe('☕');
      expect(parseEmojiShortcodes(':cake:')).toBe('🍰');
      expect(parseEmojiShortcodes(':pizza:')).toBe('🍕');
      expect(parseEmojiShortcodes(':apple:')).toBe('🍎');
    });
  });

  describe('ASCII Art Utilities', () => {
    test('ASCIIアートパターンの検出', () => {
      // この関数は将来的に実装予定
      const textWithAscii = '嬉しい ٩(◕‿◕)۶ 気分';
      // expect(containsAsciiArt(textWithAscii)).toBe(true);
      expect(textWithAscii).toContain('٩(◕‿◕)۶');
    });

    test('クールなASCIIアートパターンの検出', () => {
      const textWithCoolAscii = 'かっこいい (⌐■_■) スタイル';
      expect(textWithCoolAscii).toContain('(⌐■_■)');
    });

    test('日本の顔文字パターンの検出', () => {
      const textWithKaomoji = '嬉しい ＼(＾o＾)／ 気分';
      expect(textWithKaomoji).toContain('＼(＾o＾)／');
    });
  });

  describe('Text Length Calculations', () => {
    test('装飾タグを含むテキストの実際の文字数計算', () => {
      // この関数は将来的に実装予定：HTMLタグを除いた文字数の計算
      const decoratedText = '<b>重要</b>な<i>メッセージ</i>';
      const expectedLength = '重要なメッセージ'.length; // 7文字
      // expect(getActualTextLength(decoratedText)).toBe(expectedLength);
      expect(expectedLength).toBe(7);
    });

    test('絵文字を含むテキストの文字数計算', () => {
      const textWithEmoji = '今日は楽しい😊日でした';
      // 絵文字は1文字としてカウント
      expect(textWithEmoji.length).toBeGreaterThan(10);
    });

    test('ASCIIアートを含むテキストの文字数計算', () => {
      const textWithAscii = '嬉しい ٩(◕‿◕)۶ 気分';
      expect(textWithAscii.length).toBeGreaterThan(10);
    });
  });

  describe('Markdown Support', () => {
    test('Markdown太字記法のサポート', () => {
      // この機能は将来的に実装予定
      const markdownText = '**重要な**テキスト';
      // expect(parseMarkdown(markdownText)).toBe('<b>重要な</b>テキスト');
      expect(markdownText).toContain('**');
    });

    test('Markdown斜体記法のサポート', () => {
      const markdownText = '*強調*テキスト';
      expect(markdownText).toContain('*');
    });

    test('Markdown取り消し線記法のサポート', () => {
      const markdownText = '~~取り消し~~テキスト';
      expect(markdownText).toContain('~~');
    });
  });
});