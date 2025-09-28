import { Request, Response, NextFunction } from 'express';

/**
 * バリデーションエラーのカスタムクラス
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * 日記作成時のバリデーション
 */
export const validateCreateDiary = (req: Request, res: Response, next: NextFunction) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'テキストは必須です',
      field: 'text'
    });
  }

  if (text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'テキストを入力してください',
      field: 'text'
    });
  }

  if (text.length > 140) {
    return res.status(400).json({
      success: false,
      error: 'テキストは140文字以内で入力してください',
      field: 'text'
    });
  }

  next();
};

/**
 * 日記更新時のバリデーション
 */
export const validateUpdateDiary = (req: Request, res: Response, next: NextFunction) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'テキストは必須です',
      field: 'text'
    });
  }

  if (text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'テキストを入力してください',
      field: 'text'
    });
  }

  if (text.length > 140) {
    return res.status(400).json({
      success: false,
      error: 'テキストは140文字以内で入力してください',
      field: 'text'
    });
  }

  next();
};

/**
 * ページネーションパラメータのバリデーション
 */
export const validatePaginationParams = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    return res.status(400).json({
      success: false,
      error: 'ページ番号は1以上の数値である必要があります',
      field: 'page'
    });
  }

  if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    return res.status(400).json({
      success: false,
      error: '取得件数は1〜100の範囲で指定してください',
      field: 'limit'
    });
  }

  next();
};