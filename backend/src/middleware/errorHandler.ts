import { Request, Response, NextFunction } from 'express';

/**
 * エラーハンドリングミドルウェア
 */
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  // Multerエラー（ファイルアップロード関連）
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'ファイルサイズが制限を超えています（最大5MB）',
      field: 'image'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'アップロードできるファイル数を超えています',
      field: 'image'
    });
  }

  // バリデーションエラー
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: error.message,
      field: error.field
    });
  }

  // デフォルトエラー
  res.status(500).json({
    success: false,
    error: '内部サーバーエラーが発生しました'
  });
};

/**
 * 404ハンドラー
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'リクエストされたリソースが見つかりません'
  });
};

/**
 * CORS設定
 */
export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};