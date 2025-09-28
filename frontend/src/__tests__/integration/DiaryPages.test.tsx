import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiaryCreatePage } from '../../pages/DiaryCreatePage';
import { DiaryEditPage } from '../../pages/DiaryEditPage';
import { DiaryListPage } from '../../pages/DiaryListPage';
import { BrowserRouter } from 'react-router-dom';

// APIモック
const mockCreateDiary = vi.fn();
const mockUpdateDiary = vi.fn();
const mockGetDiaries = vi.fn();

vi.mock('../../hooks/useDiary', () => ({
  useDiary: () => ({
    createDiary: mockCreateDiary,
    updateDiary: mockUpdateDiary,
    getDiaries: mockGetDiaries,
    loading: false,
    error: null
  })
}));

describe('Diary Create Page Integration', () => {
  beforeEach(() => {
    mockCreateDiary.mockClear();
    mockUpdateDiary.mockClear();
    mockGetDiaries.mockClear();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('装飾付きテキストで日記を作成できる', async () => {
    const user = userEvent.setup();
    mockCreateDiary.mockResolvedValue({
      id: '1',
      text: '<b>今日は素晴らしい</b>一日でした',
      createdAt: new Date().toISOString()
    });

    renderWithRouter(<DiaryCreatePage />);

    // テキストを入力
    const textArea = screen.getByRole('textbox', { name: /日記|Diary/i });
    await user.type(textArea, '今日は素晴らしい一日でした');

    // テキストを選択
    textArea.setSelectionRange(2, 6); // "素晴らしい" を選択

    // 太字ボタンをクリック
    const boldButton = screen.getByRole('button', { name: /太字|Bold/i });
    await user.click(boldButton);

    // 投稿ボタンをクリック
    const submitButton = screen.getByRole('button', { name: /投稿|Post/i });
    await user.click(submitButton);

    // APIが正しいデータで呼ばれることを確認
    await waitFor(() => {
      expect(mockCreateDiary).toHaveBeenCalledWith({
        text: '今日は<b>素晴らしい</b>一日でした',
        image: null
      });
    });
  });

  test('絵文字を含むテキストで日記を作成できる', async () => {
    const user = userEvent.setup();
    mockCreateDiary.mockResolvedValue({
      id: '2',
      text: '今日は楽しかった😊',
      createdAt: new Date().toISOString()
    });

    renderWithRouter(<DiaryCreatePage />);

    const textArea = screen.getByRole('textbox', { name: /日記|Diary/i });
    await user.type(textArea, '今日は楽しかった');

    // 絵文字ピッカーを開く
    const emojiButton = screen.getByRole('button', { name: /絵文字|Emoji/i });
    await user.click(emojiButton);

    // 笑顔の絵文字を選択
    const smileEmoji = screen.getByRole('button', { name: /😊|smile/i });
    await user.click(smileEmoji);

    // テキストエリアに絵文字が追加されることを確認
    expect(textArea).toHaveValue('今日は楽しかった😊');

    // 投稿
    const submitButton = screen.getByRole('button', { name: /投稿|Post/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateDiary).toHaveBeenCalledWith({
        text: '今日は楽しかった😊',
        image: null
      });
    });
  });

  test('ASCIIアートを含むテキストで日記を作成できる', async () => {
    const user = userEvent.setup();
    mockCreateDiary.mockResolvedValue({
      id: '3',
      text: '嬉しい ٩(◕‿◕)۶ 気分',
      createdAt: new Date().toISOString()
    });

    renderWithRouter(<DiaryCreatePage />);

    const textArea = screen.getByRole('textbox', { name: /日記|Diary/i });
    await user.type(textArea, '嬉しい 気分');

    // カーソルを「嬉しい 」の後に移動
    textArea.setSelectionRange(4, 4);

    // ASCIIアートピッカーを開く
    const asciiButton = screen.getByRole('button', { name: /顔文字|ASCII/i });
    await user.click(asciiButton);

    // 嬉しい顔文字を選択
    const happyAscii = screen.getByRole('button', { name: /٩\(◕‿◕\)۶/ });
    await user.click(happyAscii);

    // テキストエリアにASCIIアートが挿入されることを確認
    expect(textArea).toHaveValue('嬉しい ٩(◕‿◕)۶ 気分');

    // 投稿
    const submitButton = screen.getByRole('button', { name: /投稿|Post/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateDiary).toHaveBeenCalledWith({
        text: '嬉しい ٩(◕‿◕)۶ 気分',
        image: null
      });
    });
  });

  test('画像と装飾付きテキストで日記を作成できる', async () => {
    const user = userEvent.setup();
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    mockCreateDiary.mockResolvedValue({
      id: '4',
      text: '<b>美しい</b>景色😊',
      imageUrl: '/uploads/test.jpg',
      createdAt: new Date().toISOString()
    });

    renderWithRouter(<DiaryCreatePage />);

    // テキスト入力と装飾
    const textArea = screen.getByRole('textbox', { name: /日記|Diary/i });
    await user.type(textArea, '美しい景色');

    // "美しい" を選択して太字にする
    textArea.setSelectionRange(0, 3);
    const boldButton = screen.getByRole('button', { name: /太字|Bold/i });
    await user.click(boldButton);

    // 絵文字を追加
    const emojiButton = screen.getByRole('button', { name: /絵文字|Emoji/i });
    await user.click(emojiButton);
    const smileEmoji = screen.getByRole('button', { name: /😊|smile/i });
    await user.click(smileEmoji);

    // 画像をアップロード
    const fileInput = screen.getByLabelText(/画像|Image/i);
    await user.upload(fileInput, mockFile);

    // 投稿
    const submitButton = screen.getByRole('button', { name: /投稿|Post/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateDiary).toHaveBeenCalledWith({
        text: '<b>美しい</b>景色😊',
        image: mockFile
      });
    });
  });

  test('140文字を超える場合エラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DiaryCreatePage />);

    const textArea = screen.getByRole('textbox', { name: /日記|Diary/i });
    const longText = 'あ'.repeat(141);
    await user.type(textArea, longText);

    // 文字数制限エラーが表示される
    expect(screen.getByText(/140文字|文字数制限/i)).toBeInTheDocument();

    // 投稿ボタンが無効になる
    const submitButton = screen.getByRole('button', { name: /投稿|Post/i });
    expect(submitButton).toBeDisabled();
  });

  test('リアルタイム文字数カウンターが動作する', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DiaryCreatePage />);

    const textArea = screen.getByRole('textbox', { name: /日記|Diary/i });
    
    // 初期状態
    expect(screen.getByText('0 / 140')).toBeInTheDocument();

    // テキスト入力
    await user.type(textArea, 'テスト投稿');
    expect(screen.getByText('5 / 140')).toBeInTheDocument();

    // 装飾を追加
    textArea.setSelectionRange(0, 5);
    const boldButton = screen.getByRole('button', { name: /太字|Bold/i });
    await user.click(boldButton);
    
    // 装飾タグを含む文字数が表示される
    expect(screen.getByText('12 / 140')).toBeInTheDocument(); // <b>テスト投稿</b>
  });

  test('プレビュー機能で装飾が正しく表示される', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DiaryCreatePage />);

    const textArea = screen.getByRole('textbox', { name: /日記|Diary/i });
    await user.type(textArea, '今日は素晴らしい日でした');

    // 太字装飾
    textArea.setSelectionRange(2, 6); // "素晴らしい"
    const boldButton = screen.getByRole('button', { name: /太字|Bold/i });
    await user.click(boldButton);

    // プレビューモードに切り替え
    const previewButton = screen.getByRole('button', { name: /プレビュー|Preview/i });
    await user.click(previewButton);

    // プレビューエリアで装飾が適用されていることを確認
    const previewArea = screen.getByTestId('preview-area');
    expect(previewArea.innerHTML).toContain('<b>素晴らしい</b>');
  });
});

describe('Diary Edit Page Integration', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('既存の装飾付き日記を編集できる', async () => {
    const user = userEvent.setup();
    const existingDiary = {
      id: '1',
      text: '<b>今日は</b>良い日でした😊',
      imageUrl: '/uploads/existing.jpg',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    mockUpdateDiary.mockResolvedValue({
      ...existingDiary,
      text: '<b>今日は</b><i>とても</i>良い日でした😊',
      updatedAt: new Date().toISOString()
    });

    renderWithRouter(<DiaryEditPage diary={existingDiary} />);

    // 既存のテキストが表示されている
    const textArea = screen.getByRole('textbox', { name: /日記|Diary/i });
    expect(textArea).toHaveValue('<b>今日は</b>良い日でした😊');

    // テキストを編集（"とても"を追加）
    textArea.setSelectionRange(11, 11); // "</b>"の後
    await user.type(textArea, '<i>とても</i>');

    // 更新ボタンをクリック
    const updateButton = screen.getByRole('button', { name: /更新|Update/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateDiary).toHaveBeenCalledWith('1', {
        text: '<b>今日は</b><i>とても</i>良い日でした😊',
        image: null
      });
    });
  });

  test('編集時に新しい装飾を追加できる', async () => {
    const user = userEvent.setup();
    const existingDiary = {
      id: '1',
      text: '普通のテキストです',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    renderWithRouter(<DiaryEditPage diary={existingDiary} />);

    const textArea = screen.getByRole('textbox', { name: /日記|Diary/i });
    
    // テキストを選択して装飾を追加
    textArea.setSelectionRange(0, 3); // "普通の"
    const underlineButton = screen.getByRole('button', { name: /下線|Underline/i });
    await user.click(underlineButton);

    // 絵文字を追加
    textArea.setSelectionRange(textArea.value.length, textArea.value.length);
    const emojiButton = screen.getByRole('button', { name: /絵文字|Emoji/i });
    await user.click(emojiButton);
    const smileEmoji = screen.getByRole('button', { name: /😊|smile/i });
    await user.click(smileEmoji);

    const updateButton = screen.getByRole('button', { name: /更新|Update/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateDiary).toHaveBeenCalledWith('1', {
        text: '<u>普通の</u>テキストです😊',
        image: null
      });
    });
  });
});

describe('Diary List Page Integration', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('装飾付きの日記一覧が正しく表示される', async () => {
    const mockDiaries = [
      {
        id: '1',
        text: '<b>今日は</b>素晴らしい日でした😊',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        text: '嬉しい ٩(◕‿◕)۶ 気分です',
        imageUrl: '/uploads/happy.jpg',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      }
    ];

    mockGetDiaries.mockResolvedValue(mockDiaries);

    renderWithRouter(<DiaryListPage />);

    await waitFor(() => {
      // 装飾付きテキストがHTMLとして正しくレンダリングされる
      expect(screen.getByText('今日は')).toBeInTheDocument();
      expect(screen.getByText('素晴らしい日でした😊')).toBeInTheDocument();
      expect(screen.getByText('嬉しい ٩(◕‿◕)۶ 気分です')).toBeInTheDocument();
    });
  });

  test('検索機能で装飾付きテキストも検索できる', async () => {
    const user = userEvent.setup();
    const mockDiaries = [
      {
        id: '1',
        text: '<b>重要な</b>会議がありました',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        text: '普通の日記です',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      }
    ];

    mockGetDiaries.mockResolvedValue(mockDiaries);

    renderWithRouter(<DiaryListPage />);

    // 検索ボックスに入力
    const searchBox = screen.getByPlaceholderText(/検索|Search/i);
    await user.type(searchBox, '重要');

    // フィルタリングされた結果が表示される
    await waitFor(() => {
      expect(screen.getByText(/重要な/)).toBeInTheDocument();
      expect(screen.queryByText('普通の日記です')).not.toBeInTheDocument();
    });
  });
});