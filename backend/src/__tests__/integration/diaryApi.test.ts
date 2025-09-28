import request from 'supertest';
import { app } from '../../app';
import path from 'path';
import fs from 'fs';

describe('Diary API Integration Tests', () => {
  const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

  beforeAll(() => {
    // テスト用画像ファイルを作成（実際のプロジェクトでは事前に用意）
    const fixturesDir = path.dirname(testImagePath);
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
    
    // 小さなテスト用JPEGファイルを作成
    const testImageBuffer = Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA==', 'base64');
    if (!fs.existsSync(testImagePath)) {
      fs.writeFileSync(testImagePath, testImageBuffer);
    }
  });

  afterAll(() => {
    // テストファイルのクリーンアップ
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  describe('POST /api/diaries - Text Decoration Features', () => {
    test('太字装飾付きテキストで日記を作成できる', async () => {
      const textWithBold = '<b>今日は素晴らしい一日でした</b>';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithBold)
        .expect(201);

      expect(response.body.text).toBe(textWithBold);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    test('斜体装飾付きテキストで日記を作成できる', async () => {
      const textWithItalic = '<i>思考を整理する時間が必要だ</i>';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithItalic)
        .expect(201);

      expect(response.body.text).toBe(textWithItalic);
    });

    test('下線装飾付きテキストで日記を作成できる', async () => {
      const textWithUnderline = '<u>重要なことを忘れないように</u>';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithUnderline)
        .expect(201);

      expect(response.body.text).toBe(textWithUnderline);
    });

    test('取り消し線装飾付きテキストで日記を作成できる', async () => {
      const textWithStrike = '<s>昨日の予定はキャンセル</s> 新しい計画を立てる';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithStrike)
        .expect(201);

      expect(response.body.text).toBe(textWithStrike);
    });

    test('カラー装飾付きテキストで日記を作成できる', async () => {
      const textWithColor = '<span style="color: blue;">青い空を見上げて</span>';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithColor)
        .expect(201);

      expect(response.body.text).toBe(textWithColor);
    });

    test('フォントサイズ装飾付きテキストで日記を作成できる', async () => {
      const textWithSize = '<span style="font-size: large;">大切な気づき</span>';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithSize)
        .expect(201);

      expect(response.body.text).toBe(textWithSize);
    });

    test('複数の装飾を組み合わせたテキストで日記を作成できる', async () => {
      const complexText = '<b><i>今日は</i></b><u>特別な日</u>で<span style="color: red;">感動</span>しました';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', complexText)
        .expect(201);

      expect(response.body.text).toBe(complexText);
    });

    test('Markdown形式の装飾で日記を作成できる', async () => {
      const markdownText = '**重要な発見**があり、*とても*嬉しい ~~昨日は失敗したけど~~';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', markdownText)
        .expect(201);

      expect(response.body.text).toBe(markdownText);
    });
  });

  describe('POST /api/diaries - Emoji Features', () => {
    test('絵文字付きテキストで日記を作成できる', async () => {
      const textWithEmojis = '今日は楽しかった😀😃😄';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithEmojis)
        .expect(201);

      expect(response.body.text).toBe(textWithEmojis);
    });

    test('天気絵文字付きテキストで日記を作成できる', async () => {
      const textWithWeatherEmojis = '晴れ☀️のち雨☔時々曇り☁️';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithWeatherEmojis)
        .expect(201);

      expect(response.body.text).toBe(textWithWeatherEmojis);
    });

    test('感情絵文字付きテキストで日記を作成できる', async () => {
      const textWithEmotionEmojis = '嬉しい😊悲しい😢怒り😠驚き😲';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithEmotionEmojis)
        .expect(201);

      expect(response.body.text).toBe(textWithEmotionEmojis);
    });

    test('絵文字と装飾を組み合わせたテキストで日記を作成できる', async () => {
      const complexTextWithEmojis = '<b>今日は</b>とても<i>楽しかった</i>😀🎉';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', complexTextWithEmojis)
        .expect(201);

      expect(response.body.text).toBe(complexTextWithEmojis);
    });
  });

  describe('POST /api/diaries - ASCII Art Features', () => {
    test('ASCIIアート付きテキストで日記を作成できる', async () => {
      const textWithAscii = '今日は嬉しい ٩(◕‿◕)۶';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithAscii)
        .expect(201);

      expect(response.body.text).toBe(textWithAscii);
    });

    test('クールなASCIIアート付きテキストで日記を作成できる', async () => {
      const textWithCoolAscii = 'クール (⌐■_■) な一日でした';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithCoolAscii)
        .expect(201);

      expect(response.body.text).toBe(textWithCoolAscii);
    });

    test('日本の顔文字付きテキストで日記を作成できる', async () => {
      const textWithJapaneseKaomoji = '嬉しい ＼(＾o＾)／ 気分です';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithJapaneseKaomoji)
        .expect(201);

      expect(response.body.text).toBe(textWithJapaneseKaomoji);
    });

    test('ASCIIアートと絵文字を組み合わせたテキストで日記を作成できる', async () => {
      const complexTextWithAsciiAndEmoji = '楽しい ٩(◕‿◕)۶ 一日でした😊🎉';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', complexTextWithAsciiAndEmoji)
        .expect(201);

      expect(response.body.text).toBe(complexTextWithAsciiAndEmoji);
    });
  });

  describe('POST /api/diaries - Validation Tests', () => {
    test('140文字を超える装飾付きテキストでエラーが発生する', async () => {
      const longDecoratedText = '<b>' + 'あ'.repeat(139) + '</b>'; // 142文字
      
      await request(app)
        .post('/api/diaries')
        .field('text', longDecoratedText)
        .expect(400);
    });

    test('空の装飾タグのみの場合エラーが発生する', async () => {
      const emptyDecoratedText = '<b></b><i></i><u></u>';
      
      await request(app)
        .post('/api/diaries')
        .field('text', emptyDecoratedText)
        .expect(400);
    });

    test('不正なHTMLタグが含まれる場合もテキストとして受け入れる', async () => {
      const textWithInvalidTags = '<script>alert("test")</script>普通のテキスト';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', textWithInvalidTags)
        .expect(201);

      expect(response.body.text).toBe(textWithInvalidTags);
    });
  });

  describe('POST /api/diaries - File Upload with Decorations', () => {
    test('装飾付きテキストと画像で日記を作成できる', async () => {
      const decoratedText = '<b>美しい</b><i>景色</i>を見ました😊';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', decoratedText)
        .attach('image', testImagePath)
        .expect(201);

      expect(response.body.text).toBe(decoratedText);
      expect(response.body.imageUrl).toBeDefined();
      expect(response.body.imageUrl).toMatch(/\.(jpg|jpeg|png|gif|webp)$/);
    });

    test('絵文字付きテキストと画像で日記を作成できる', async () => {
      const emojiText = '今日の写真📸です😊';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', emojiText)
        .attach('image', testImagePath)
        .expect(201);

      expect(response.body.text).toBe(emojiText);
      expect(response.body.imageUrl).toBeDefined();
    });

    test('ASCIIアート付きテキストと画像で日記を作成できる', async () => {
      const asciiText = 'いい写真が撮れた ٩(◕‿◕)۶';
      
      const response = await request(app)
        .post('/api/diaries')
        .field('text', asciiText)
        .attach('image', testImagePath)
        .expect(201);

      expect(response.body.text).toBe(asciiText);
      expect(response.body.imageUrl).toBeDefined();
    });
  });

  describe('GET /api/diaries - Decorated Content Retrieval', () => {
    test('装飾付きの日記一覧を取得できる', async () => {
      // 装飾付き日記を作成
      const decoratedText = '<b>テスト</b>用の<i>装飾</i>付き日記😊';
      await request(app)
        .post('/api/diaries')
        .field('text', decoratedText);

      const response = await request(app)
        .get('/api/diaries')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // 作成した装飾付き日記が含まれているかチェック
      const createdDiary = response.body.find((diary: any) => diary.text === decoratedText);
      expect(createdDiary).toBeDefined();
    });
  });

  describe('PUT /api/diaries/:id - Update with Decorations', () => {
    test('装飾付きテキストで日記を更新できる', async () => {
      // まず日記を作成
      const createResponse = await request(app)
        .post('/api/diaries')
        .field('text', '普通のテキスト')
        .expect(201);

      const diaryId = createResponse.body.id;
      const updatedDecoratedText = '<b>更新された</b><i>装飾付き</i>テキスト🎉';

      // 装飾付きテキストで更新
      const updateResponse = await request(app)
        .put(`/api/diaries/${diaryId}`)
        .field('text', updatedDecoratedText)
        .expect(200);

      expect(updateResponse.body.text).toBe(updatedDecoratedText);
      expect(updateResponse.body.updatedAt).toBeDefined();
    });
  });
});