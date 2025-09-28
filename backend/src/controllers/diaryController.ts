import { Request, Response } from 'express';
import { diaryService } from '../services/DiaryService';
import { deleteFile } from '../middleware/upload';
import { DiaryQueryParams } from '../types';
import path from 'path';

/**
 * 日記コントローラー
 */
export class DiaryController {
  /**
   * 日記一覧取得
   */
  async getDiaries(req: Request, res: Response) {
    try {
      const params: DiaryQueryParams = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        search: req.query.search as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string
      };

      const result = await diaryService.getDiaries(params);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('日記一覧取得エラー:', error);
      res.status(500).json({
        success: false,
        error: '日記一覧の取得に失敗しました'
      });
    }
  }

  /**
   * 個別日記取得
   */
  async getDiaryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const diary = await diaryService.getDiaryById(id);

      if (!diary) {
        return res.status(404).json({
          success: false,
          error: '指定された日記が見つかりません'
        });
      }

      res.json({
        success: true,
        data: diary
      });
    } catch (error) {
      console.error('日記取得エラー:', error);
      res.status(500).json({
        success: false,
        error: '日記の取得に失敗しました'
      });
    }
  }

  /**
   * 日記作成
   */
  async createDiary(req: Request, res: Response) {
    try {
      const { text } = req.body;
      const file = req.file;

      let imageUrl: string | undefined;
      if (file) {
        imageUrl = `/uploads/${file.filename}`;
      }

      const diary = await diaryService.createDiary({ text }, imageUrl);

      res.status(201).json({
        success: true,
        data: diary,
        message: '日記を作成しました'
      });
    } catch (error) {
      console.error('日記作成エラー:', error);
      
      // アップロードされたファイルがある場合は削除
      if (req.file) {
        deleteFile(req.file.filename);
      }

      res.status(500).json({
        success: false,
        error: '日記の作成に失敗しました'
      });
    }
  }

  /**
   * 日記更新
   */
  async updateDiary(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { text } = req.body;

      const diary = await diaryService.updateDiary(id, { text });

      if (!diary) {
        return res.status(404).json({
          success: false,
          error: '指定された日記が見つかりません'
        });
      }

      res.json({
        success: true,
        data: diary,
        message: '日記を更新しました'
      });
    } catch (error) {
      console.error('日記更新エラー:', error);
      res.status(500).json({
        success: false,
        error: '日記の更新に失敗しました'
      });
    }
  }

  /**
   * 日記削除
   */
  async deleteDiary(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // 削除前に日記を取得（画像ファイル削除のため）
      const diary = await diaryService.getDiaryById(id);
      
      if (!diary) {
        return res.status(404).json({
          success: false,
          error: '指定された日記が見つかりません'
        });
      }

      const success = await diaryService.deleteDiary(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: '日記の削除に失敗しました'
        });
      }

      // 画像ファイルがある場合は削除
      if (diary.imageUrl) {
        const filename = path.basename(diary.imageUrl);
        deleteFile(filename);
      }

      res.json({
        success: true,
        message: '日記を削除しました'
      });
    } catch (error) {
      console.error('日記削除エラー:', error);
      res.status(500).json({
        success: false,
        error: '日記の削除に失敗しました'
      });
    }
  }
}

export const diaryController = new DiaryController();