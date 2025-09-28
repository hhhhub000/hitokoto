import { Diary, CreateDiaryDTO, UpdateDiaryDTO, DiaryQueryParams, PaginatedResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * モックデータサービス
 * 実際のデータベースの代わりにメモリ内でデータを管理
 */
class DiaryService {
  private diaries: Diary[] = [];

  /**
   * 日記一覧を取得（ページネーション、検索対応）
   */
  async getDiaries(params: DiaryQueryParams): Promise<PaginatedResponse<Diary>> {
    const { page = 1, limit = 10, search, startDate, endDate } = params;
    
    let filteredDiaries = [...this.diaries];

    // キーワード検索
    if (search) {
      filteredDiaries = filteredDiaries.filter(diary =>
        diary.text.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 日付範囲フィルタ
    if (startDate) {
      const start = new Date(startDate);
      filteredDiaries = filteredDiaries.filter(diary => diary.createdAt >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // 終日まで含める
      filteredDiaries = filteredDiaries.filter(diary => diary.createdAt <= end);
    }

    // 新しい順でソート
    filteredDiaries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // ページネーション
    const total = filteredDiaries.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedDiaries = filteredDiaries.slice(offset, offset + limit);

    return {
      data: paginatedDiaries,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  /**
   * 個別日記を取得
   */
  async getDiaryById(id: string): Promise<Diary | null> {
    return this.diaries.find(diary => diary.id === id) || null;
  }

  /**
   * 新規日記を作成
   */
  async createDiary(data: CreateDiaryDTO, imageUrl?: string): Promise<Diary> {
    const now = new Date();
    const diary: Diary = {
      id: uuidv4(),
      text: data.text,
      imageUrl,
      createdAt: now,
      updatedAt: now
    };

    this.diaries.push(diary);
    return diary;
  }

  /**
   * 日記を更新（テキストのみ）
   */
  async updateDiary(id: string, data: UpdateDiaryDTO): Promise<Diary | null> {
    const index = this.diaries.findIndex(diary => diary.id === id);
    
    if (index === -1) {
      return null;
    }

    this.diaries[index] = {
      ...this.diaries[index],
      text: data.text,
      updatedAt: new Date()
    };

    return this.diaries[index];
  }

  /**
   * 日記を削除
   */
  async deleteDiary(id: string): Promise<boolean> {
    const index = this.diaries.findIndex(diary => diary.id === id);
    
    if (index === -1) {
      return false;
    }

    this.diaries.splice(index, 1);
    return true;
  }

  /**
   * 開発・テスト用のサンプルデータを追加
   */
  async seedSampleData(): Promise<void> {
    const sampleDiaries: Omit<Diary, 'id'>[] = [
      {
        text: '今日は天気が良くて散歩日和でした！桜がとても綺麗だった。',
        createdAt: new Date('2025-09-28T10:30:00'),
        updatedAt: new Date('2025-09-28T10:30:00')
      },
      {
        text: 'カフェで読書。コーヒーがとても美味しかった。',
        createdAt: new Date('2025-09-27T15:45:00'),
        updatedAt: new Date('2025-09-27T15:45:00')
      },
      {
        text: '友達と映画を見た。笑って泣いて楽しい一日だった。',
        createdAt: new Date('2025-09-26T20:15:00'),
        updatedAt: new Date('2025-09-26T20:15:00')
      },
      {
        text: '新しいレシピに挑戦。意外と上手くできて満足！',
        createdAt: new Date('2025-09-25T18:00:00'),
        updatedAt: new Date('2025-09-25T18:00:00')
      },
      {
        text: '朝のジョギング。清々しい気持ちで一日をスタート。',
        createdAt: new Date('2025-09-24T07:30:00'),
        updatedAt: new Date('2025-09-24T07:30:00')
      }
    ];

    for (const sampleDiary of sampleDiaries) {
      this.diaries.push({
        ...sampleDiary,
        id: uuidv4()
      });
    }
  }
}

export const diaryService = new DiaryService();