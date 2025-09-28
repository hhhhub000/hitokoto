import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import diaryRoutes from './routes/diaries';
import { errorHandler, notFoundHandler, corsOptions } from './middleware/errorHandler';
import { diaryService } from './services/DiaryService';

const app = express();
const PORT = process.env.PORT || 3001;

// セキュリティミドルウェア
app.use(helmet());

// 圧縮
app.use(compression());

// CORS設定
app.use(cors(corsOptions));

// JSONパーサー
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静的ファイル配信（アップロードされた画像）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// APIルート
app.use('/api/diaries', diaryRoutes);

// 404ハンドラー
app.use(notFoundHandler);

// エラーハンドリング
app.use(errorHandler);

// サーバー起動
const startServer = async () => {
  try {
    // サンプルデータの初期化
    await diaryService.seedSampleData();
    console.log('✅ サンプルデータを初期化しました');

    app.listen(PORT, () => {
      console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
      console.log(`📁 アップロードディレクトリ: ${path.join(__dirname, '../uploads')}`);
      console.log(`🌐 CORS許可オリジン: ${corsOptions.origin}`);
    });
  } catch (error) {
    console.error('❌ サーバー起動エラー:', error);
    process.exit(1);
  }
};

startServer();