# ひとこと日記 Webアプリ

このプロジェクトは、日々の出来事や気持ちを写真と一緒に一言で記録できるシンプルな日記アプリです。

## 技術スタック

### フロントエンド
- **React 18** + TypeScript
- **Vite** - 高速なビルドツール
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **Zustand** - 軽量な状態管理ライブラリ
- **React Router** - SPA用ルーティング
- **Axios** - HTTP クライアント

### バックエンド
- **Node.js** + **Express** + TypeScript
- **Multer** - ファイルアップロード処理
- **UUID** - ユニークID生成
- **CORS** - クロスオリジンリクエスト対応
- **Helmet** - セキュリティヘッダー設定

### 開発環境
- **Docker** + **Docker Compose**
- **ESLint** + **Prettier** - コード品質管理
- **Jest** - テストフレームワーク

## 機能

### ✅ 実装済み機能

1. **日記投稿機能**
   - テキスト入力（140文字制限）
   - 画像アップロード（JPEG/PNG/GIF、最大5MB）
   - リアルタイム文字数カウント
   - バリデーション機能

2. **日記一覧表示機能**
   - 投稿日時順での表示
   - ページネーション（10件/ページ）
   - レスポンシブなカードレイアウト

3. **日記詳細表示機能**
   - 個別日記の詳細表示
   - 画像の大きな表示

4. **日記編集機能**
   - テキストの編集（画像は変更不可）
   - 更新日時の自動記録

5. **日記削除機能**
   - 確認ダイアログ付き削除
   - 関連画像ファイルの自動削除

6. **UI/UX**
   - レスポンシブデザイン
   - ローディング表示
   - エラーハンドリング
   - アクセシブルなUI

### 🔄 部分実装
- 検索・フィルタ機能（バックエンドのみ）

### 📋 今後の拡張予定
- フロントエンド検索UI
- 画像のリサイズ・圧縮
- PWA対応
- ダークモード
- ユーザー認証
- 実際のデータベース対応

## セットアップ

### 前提条件
- Node.js 18+
- npm 8+
- Docker & Docker Compose（オプション）

### ローカル開発環境

#### 1. クローンとセットアップ
```bash
git clone <repository-url>
cd hitokoto
```

#### 2. バックエンドのセットアップ
```bash
cd backend
npm install
npm run dev
```
サーバーが http://localhost:3001 で起動します。

#### 3. フロントエンドのセットアップ
```bash
cd frontend
npm install
npm run dev
```
アプリが http://localhost:5173 で起動します。

### Docker での起動

```bash
# 全体のビルドと起動
docker-compose up --build

# バックグラウンドで起動
docker-compose up -d
```

## プロジェクト構造

```
hitokoto/
├── .github/                 # GitHub設定
│   └── copilot-instructions.md
├── docs/                    # ドキュメント
│   ├── requirements.md
│   └── specifications.md
├── backend/                 # バックエンド
│   ├── src/
│   │   ├── controllers/     # APIコントローラー
│   │   ├── services/        # ビジネスロジック
│   │   ├── routes/          # ルーティング
│   │   ├── middleware/      # ミドルウェア
│   │   ├── types/           # TypeScript型定義
│   │   └── utils/           # ユーティリティ
│   ├── uploads/             # アップロードファイル
│   └── package.json
├── frontend/                # フロントエンド
│   ├── src/
│   │   ├── components/      # Reactコンポーネント
│   │   │   ├── common/      # 共通コンポーネント
│   │   │   ├── diary/       # 日記関連コンポーネント
│   │   │   └── layout/      # レイアウトコンポーネント
│   │   ├── pages/           # ページコンポーネント
│   │   ├── stores/          # Zustand状態管理
│   │   ├── types/           # TypeScript型定義
│   │   ├── utils/           # ユーティリティ
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── docker-compose.yml       # Docker Compose設定
```

## API エンドポイント

| メソッド | エンドポイント | 説明 |
|----------|---------------|------|
| GET | `/api/diaries` | 日記一覧取得 |
| GET | `/api/diaries/:id` | 個別日記取得 |
| POST | `/api/diaries` | 日記作成 |
| PUT | `/api/diaries/:id` | 日記更新 |
| DELETE | `/api/diaries/:id` | 日記削除 |
| GET | `/health` | ヘルスチェック |

## 開発ガイドライン

詳細な開発ガイドラインは `.github/copilot-instructions.md` を参照してください。

### 主要な原則
1. **仕様書の事前更新必須** - 機能追加前に必ず仕様書を更新
2. **テスト駆動開発** - 実装前にテストを作成
3. **疎結合設計** - 各機能は独立性を保つ
4. **型安全性** - TypeScriptの厳密な型チェックを活用

## ライセンス

MIT License

## 作成者

作成日: 2025年9月28日