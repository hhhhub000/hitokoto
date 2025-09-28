import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextDecorationToolbar } from '../../components/diary/TextDecorationToolbar';
import { EmojiPicker } from '../../components/diary/EmojiPicker';
import { AsciiArtPicker } from '../../components/diary/AsciiArtPicker';

describe('TextDecorationToolbar Component', () => {
  const mockOnTextChange = vi.fn();
  const mockOnDecorationChange = vi.fn();

  beforeEach(() => {
    mockOnTextChange.mockClear();
    mockOnDecorationChange.mockClear();
  });

  test('太字ボタンがクリックされたときに装飾が適用される', async () => {
    const user = userEvent.setup();
    
    render(
      <TextDecorationToolbar
        selectedText="テストテキスト"
        onTextChange={mockOnTextChange}
        onDecorationChange={mockOnDecorationChange}
      />
    );

    const boldButton = screen.getByRole('button', { name: /太字|Bold/i });
    await user.click(boldButton);

    expect(mockOnDecorationChange).toHaveBeenCalledWith({
      type: 'bold',
      applied: true
    });
  });

  test('斜体ボタンがクリックされたときに装飾が適用される', async () => {
    const user = userEvent.setup();
    
    render(
      <TextDecorationToolbar
        selectedText="テストテキスト"
        onTextChange={mockOnTextChange}
        onDecorationChange={mockOnDecorationChange}
      />
    );

    const italicButton = screen.getByRole('button', { name: /斜体|Italic/i });
    await user.click(italicButton);

    expect(mockOnDecorationChange).toHaveBeenCalledWith({
      type: 'italic',
      applied: true
    });
  });

  test('下線ボタンがクリックされたときに装飾が適用される', async () => {
    const user = userEvent.setup();
    
    render(
      <TextDecorationToolbar
        selectedText="テストテキスト"
        onTextChange={mockOnTextChange}
        onDecorationChange={mockOnDecorationChange}
      />
    );

    const underlineButton = screen.getByRole('button', { name: /下線|Underline/i });
    await user.click(underlineButton);

    expect(mockOnDecorationChange).toHaveBeenCalledWith({
      type: 'underline',
      applied: true
    });
  });

  test('取り消し線ボタンがクリックされたときに装飾が適用される', async () => {
    const user = userEvent.setup();
    
    render(
      <TextDecorationToolbar
        selectedText="テストテキスト"
        onTextChange={mockOnTextChange}
        onDecorationChange={mockOnDecorationChange}
      />
    );

    const strikeButton = screen.getByRole('button', { name: /取り消し線|Strikethrough/i });
    await user.click(strikeButton);

    expect(mockOnDecorationChange).toHaveBeenCalledWith({
      type: 'strikethrough',
      applied: true
    });
  });

  test('カラーピッカーで色が変更されたときに装飾が適用される', async () => {
    const user = userEvent.setup();
    
    render(
      <TextDecorationToolbar
        selectedText="テストテキスト"
        onTextChange={mockOnTextChange}
        onDecorationChange={mockOnDecorationChange}
      />
    );

    const colorPicker = screen.getByRole('button', { name: /色|Color/i });
    await user.click(colorPicker);

    // カラーパレットが表示される
    const redColor = screen.getByRole('button', { name: /赤|Red/i });
    await user.click(redColor);

    expect(mockOnDecorationChange).toHaveBeenCalledWith({
      type: 'color',
      value: 'red'
    });
  });

  test('フォントサイズが変更されたときに装飾が適用される', async () => {
    const user = userEvent.setup();
    
    render(
      <TextDecorationToolbar
        selectedText="テストテキスト"
        onTextChange={mockOnTextChange}
        onDecorationChange={mockOnDecorationChange}
      />
    );

    const fontSizeButton = screen.getByRole('button', { name: /サイズ|Size/i });
    await user.click(fontSizeButton);

    // サイズメニューが表示される
    const largeSize = screen.getByRole('button', { name: /大|Large/i });
    await user.click(largeSize);

    expect(mockOnDecorationChange).toHaveBeenCalledWith({
      type: 'fontSize',
      value: 'large'
    });
  });

  test('選択されたテキストがない場合はボタンが無効化される', () => {
    render(
      <TextDecorationToolbar
        selectedText=""
        onTextChange={mockOnTextChange}
        onDecorationChange={mockOnDecorationChange}
      />
    );

    const boldButton = screen.getByRole('button', { name: /太字|Bold/i });
    expect(boldButton).toBeDisabled();
  });

  test('複数の装飾を組み合わせて適用できる', async () => {
    const user = userEvent.setup();
    
    render(
      <TextDecorationToolbar
        selectedText="テストテキスト"
        onTextChange={mockOnTextChange}
        onDecorationChange={mockOnDecorationChange}
      />
    );

    // 太字を適用
    const boldButton = screen.getByRole('button', { name: /太字|Bold/i });
    await user.click(boldButton);

    // 斜体を適用
    const italicButton = screen.getByRole('button', { name: /斜体|Italic/i });
    await user.click(italicButton);

    expect(mockOnDecorationChange).toHaveBeenCalledTimes(2);
    expect(mockOnDecorationChange).toHaveBeenNthCalledWith(1, {
      type: 'bold',
      applied: true
    });
    expect(mockOnDecorationChange).toHaveBeenNthCalledWith(2, {
      type: 'italic',
      applied: true
    });
  });
});

describe('EmojiPicker Component', () => {
  const mockOnEmojiSelect = vi.fn();

  beforeEach(() => {
    mockOnEmojiSelect.mockClear();
  });

  test('絵文字ピッカーが正しく表示される', () => {
    render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} />);
    
    expect(screen.getByRole('button', { name: /絵文字|Emoji/i })).toBeInTheDocument();
  });

  test('感情絵文字が選択されたときにコールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    
    render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} />);

    const emojiButton = screen.getByRole('button', { name: /絵文字|Emoji/i });
    await user.click(emojiButton);

    // 絵文字パレットが表示される
    const smileEmoji = screen.getByRole('button', { name: /😊|smile/i });
    await user.click(smileEmoji);

    expect(mockOnEmojiSelect).toHaveBeenCalledWith('😊');
  });

  test('天気絵文字が選択されたときにコールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    
    render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} />);

    const emojiButton = screen.getByRole('button', { name: /絵文字|Emoji/i });
    await user.click(emojiButton);

    // 天気タブに切り替え
    const weatherTab = screen.getByRole('tab', { name: /天気|Weather/i });
    await user.click(weatherTab);

    const sunEmoji = screen.getByRole('button', { name: /☀️|sun/i });
    await user.click(sunEmoji);

    expect(mockOnEmojiSelect).toHaveBeenCalledWith('☀️');
  });

  test('活動絵文字が選択されたときにコールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    
    render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} />);

    const emojiButton = screen.getByRole('button', { name: /絵文字|Emoji/i });
    await user.click(emojiButton);

    // 活動タブに切り替え
    const activityTab = screen.getByRole('tab', { name: /活動|Activity/i });
    await user.click(activityTab);

    const workEmoji = screen.getByRole('button', { name: /💼|work/i });
    await user.click(workEmoji);

    expect(mockOnEmojiSelect).toHaveBeenCalledWith('💼');
  });

  test('食べ物絵文字が選択されたときにコールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    
    render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} />);

    const emojiButton = screen.getByRole('button', { name: /絵文字|Emoji/i });
    await user.click(emojiButton);

    // 食べ物タブに切り替え
    const foodTab = screen.getByRole('tab', { name: /食べ物|Food/i });
    await user.click(foodTab);

    const coffeeEmoji = screen.getByRole('button', { name: /☕|coffee/i });
    await user.click(coffeeEmoji);

    expect(mockOnEmojiSelect).toHaveBeenCalledWith('☕');
  });

  test('絵文字ピッカーが閉じられる', async () => {
    const user = userEvent.setup();
    
    render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} />);

    const emojiButton = screen.getByRole('button', { name: /絵文字|Emoji/i });
    await user.click(emojiButton);

    // 絵文字パレットが表示される
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();

    // 外側をクリックして閉じる
    await user.click(document.body);

    // パレットが非表示になる
    await waitFor(() => {
      expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    });
  });

  test('検索機能で絵文字をフィルタリングできる', async () => {
    const user = userEvent.setup();
    
    render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} />);

    const emojiButton = screen.getByRole('button', { name: /絵文字|Emoji/i });
    await user.click(emojiButton);

    // 検索ボックスに入力
    const searchBox = screen.getByPlaceholderText(/検索|Search/i);
    await user.type(searchBox, 'smile');

    // フィルタリングされた絵文字のみ表示される
    expect(screen.getByRole('button', { name: /😊|smile/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /☀️|sun/i })).not.toBeInTheDocument();
  });
});

describe('AsciiArtPicker Component', () => {
  const mockOnAsciiSelect = vi.fn();

  beforeEach(() => {
    mockOnAsciiSelect.mockClear();
  });

  test('ASCIIアートピッカーが正しく表示される', () => {
    render(<AsciiArtPicker onAsciiSelect={mockOnAsciiSelect} />);
    
    expect(screen.getByRole('button', { name: /顔文字|ASCII/i })).toBeInTheDocument();
  });

  test('嬉しい顔文字が選択されたときにコールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    
    render(<AsciiArtPicker onAsciiSelect={mockOnAsciiSelect} />);

    const asciiButton = screen.getByRole('button', { name: /顔文字|ASCII/i });
    await user.click(asciiButton);

    // 嬉しい顔文字を選択
    const happyAscii = screen.getByRole('button', { name: /٩\(◕‿◕\)۶/ });
    await user.click(happyAscii);

    expect(mockOnAsciiSelect).toHaveBeenCalledWith('٩(◕‿◕)۶');
  });

  test('クールな顔文字が選択されたときにコールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    
    render(<AsciiArtPicker onAsciiSelect={mockOnAsciiSelect} />);

    const asciiButton = screen.getByRole('button', { name: /顔文字|ASCII/i });
    await user.click(asciiButton);

    // クールな顔文字を選択
    const coolAscii = screen.getByRole('button', { name: /\(⌐■_■\)/ });
    await user.click(coolAscii);

    expect(mockOnAsciiSelect).toHaveBeenCalledWith('(⌐■_■)');
  });

  test('日本の顔文字が選択されたときにコールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    
    render(<AsciiArtPicker onAsciiSelect={mockOnAsciiSelect} />);

    const asciiButton = screen.getByRole('button', { name: /顔文字|ASCII/i });
    await user.click(asciiButton);

    // 日本の顔文字タブに切り替え
    const japaneseTab = screen.getByRole('tab', { name: /日本|Japanese/i });
    await user.click(japaneseTab);

    const japaneseAscii = screen.getByRole('button', { name: /＼\(＾o＾\)／/ });
    await user.click(japaneseAscii);

    expect(mockOnAsciiSelect).toHaveBeenCalledWith('＼(＾o＾)／');
  });

  test('カテゴリ別に顔文字が表示される', async () => {
    const user = userEvent.setup();
    
    render(<AsciiArtPicker onAsciiSelect={mockOnAsciiSelect} />);

    const asciiButton = screen.getByRole('button', { name: /顔文字|ASCII/i });
    await user.click(asciiButton);

    // 感情タブ
    expect(screen.getByRole('tab', { name: /感情|Emotion/i })).toBeInTheDocument();
    
    // アクションタブ
    expect(screen.getByRole('tab', { name: /アクション|Action/i })).toBeInTheDocument();
    
    // その他タブ
    expect(screen.getByRole('tab', { name: /その他|Others/i })).toBeInTheDocument();
  });

  test('顔文字の説明が表示される', async () => {
    const user = userEvent.setup();
    
    render(<AsciiArtPicker onAsciiSelect={mockOnAsciiSelect} />);

    const asciiButton = screen.getByRole('button', { name: /顔文字|ASCII/i });
    await user.click(asciiButton);

    // 顔文字にホバーすると説明が表示される
    const happyAscii = screen.getByRole('button', { name: /٩\(◕‿◕\)۶/ });
    await user.hover(happyAscii);

    await waitFor(() => {
      expect(screen.getByText(/嬉しい|Happy/i)).toBeInTheDocument();
    });
  });
});