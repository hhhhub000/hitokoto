# GitHub Copilot Instructions - ひとこと日記 Webアプリ

## 技術スタック

### 推奨技術構成
以下の技術スタックを採用し、モダンで保守性の高いWebアプリケーションを構築してください：

- **フロントエンド**: React 18 + TypeScript + Vite
- **UIライブラリ**: Tailwind CSS + Headless UI
- **状態管理**: Zustand（軽量でシンプル）
- **バックエンド**: Node.js + Express + TypeScript
- **データベース**: SQLite（開発）/ PostgreSQL（本番）
- **ORM**: Prisma（型安全性とDX重視）
- **認証**: 将来拡張時にAuth0またはNextAuth.jsを想定
- **テスティング**: Jest + React Testing Library + Supertest
- **ビルド・開発**: Vite + ESLint + Prettier
- **コンテナ**: Docker + Docker Compose

### 想定ディレクトリ構造
```
hitokoto/
├── .github/
│   └── copilot-instructions.md
├── docs/
│   ├── requirements.md（要件定義書）
│   └── specifications.md（仕様書）
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── diary/
│   │   │   └── layout/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   └── __tests__/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── __tests__/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── uploads/
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

## 開発ルールとベストプラクティス

### 1. 仕様の追記義務 ⚠️ **厳守必須**

**機能の追加・変更を行う際は、必ず以下の手順を遵守してください：**

1. **仕様書の事前更新**: `docs/specifications.md` に実装予定の機能仕様を詳細に記述
2. **実装との一致確認**: 実装完了後、仕様書と実装内容が完全に一致していることを確認
3. **レビュー**: コードレビュー時は仕様書との整合性も必ずチェック

```markdown
<!-- specifications.md の記述例 -->
## 機能名: 日記投稿API
### エンドポイント: POST /api/diaries
### リクエスト仕様:
- Content-Type: multipart/form-data
- Fields: text (string, required, max 140), image (file, optional, max 5MB)
### レスポンス仕様:
- 成功時: 201 Created, 作成された日記オブジェクト
- エラー時: 400 Bad Request, エラーメッセージ
```

### 2. テスト駆動開発の実践 ⚠️ **厳守必須**

**実装前に必ずテストコードを作成し、Red-Green-Refactorサイクルを実践してください：**

#### テスト作成の優先順位
1. **ユニットテスト**: 各関数・メソッドの単体テスト
2. **統合テスト**: API エンドポイントのテスト
3. **E2Eテスト**: ユーザーシナリオに基づくテスト

#### 必須テストパターン
```typescript
// 例: 日記投稿機能のテスト
describe('日記投稿機能', () => {
  beforeEach(() => {
    // テストデータのセットアップ
  });

  test('正常な投稿データで日記が作成される', async () => {
    // Arrange - テストデータ準備
    const diaryData = { text: 'テスト投稿', image: mockImageFile };
    
    // Act - 実際の処理実行
    const result = await createDiary(diaryData);
    
    // Assert - 結果検証
    expect(result.text).toBe('テスト投稿');
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  test('140文字を超える投稿でエラーが発生する', async () => {
    // バリデーションエラーのテスト
  });
});
```

#### テスト実行の義務
- **新規実装時**: 実装前にテストを作成、実装後にテストが全て通ることを確認
- **既存コード修正時**: 全てのテストを実行し、デグレードがないことを確認
- **コミット前**: `npm test` で全テストが通ることを必須とする

### 3. 疎結合で保守性の高い設計 ⚠️ **厳守必須**

**各機能は独立性を保ち、変更の影響範囲を最小限に抑えてください：**

#### 設計原則
- **単一責任の原則**: 1つのクラス・関数は1つの責務のみを持つ
- **依存性注入**: 外部依存は注入により提供
- **インターフェース分離**: 必要な機能のみを公開
- **開放閉鎖の原則**: 拡張に開放的、修正に閉鎖的

#### フォルダ・ファイル分割ルール
```typescript
// ❌ 悪い例: 複数の責務が混在
// diaryManager.ts
export class DiaryManager {
  saveDiary() { /* DB保存処理 */ }
  uploadImage() { /* 画像アップロード処理 */ }
  validateInput() { /* バリデーション処理 */ }
  sendNotification() { /* 通知処理 */ }
}

// ✅ 良い例: 責務を分離
// services/diaryService.ts
export class DiaryService {
  constructor(
    private repository: DiaryRepository,
    private imageService: ImageService,
    private validator: DiaryValidator
  ) {}
  
  async createDiary(data: CreateDiaryDTO): Promise<Diary> {
    this.validator.validate(data);
    const imageUrl = await this.imageService.upload(data.image);
    return this.repository.save({ ...data, imageUrl });
  }
}
```

#### コンポーネント設計（React）
```typescript
// ✅ 良い例: 疎結合なコンポーネント設計
interface DiaryFormProps {
  onSubmit: (data: DiaryData) => void;
  isLoading?: boolean;
}

export const DiaryForm: React.FC<DiaryFormProps> = ({ onSubmit, isLoading }) => {
  // フォーム固有のロジックのみ
};

interface DiaryListProps {
  diaries: Diary[];
  onDelete: (id: string) => void;
}

export const DiaryList: React.FC<DiaryListProps> = ({ diaries, onDelete }) => {
  // リスト表示固有のロジックのみ
};
```

### 4. コード品質とベストプラクティス

#### TypeScript活用
- **厳密な型定義**: `strict: true` を有効にし、`any` の使用を禁止
- **型安全性**: すべての関数、変数に適切な型注釈
- **インターフェース活用**: データ構造を明確に定義

```typescript
// 型定義例
interface Diary {
  id: string;
  text: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateDiaryDTO {
  text: string;
  image?: File;
}
```

#### エラーハンドリング
```typescript
// カスタムエラークラスの定義
export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// エラーハンドリングミドルウェア
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message, field: error.field });
  }
  // その他のエラー処理
};
```

#### パフォーマンス考慮
- **画像最適化**: アップロード時のリサイズ・圧縮
- **ページネーション**: 大量データの効率的な取得
- **Web Components**: 再利用可能なUI部品の作成
- **Lazy Loading**: 画像やコンポーネントの遅延読み込み

### 5. セキュリティ対策

- **入力検証**: すべてのユーザー入力をサーバーサイドで検証
- **XSS対策**: DOMPurifyを使用したHTMLサニタイゼーション
- **SQLインジェクション対策**: Prisma ORMの使用でSQL直接操作を回避
- **ファイルアップロード制限**: ファイル形式・サイズの厳密なチェック

### 6. 開発フロー

1. **Issue作成**: 機能要求を明確に記述
2. **仕様書更新**: `docs/specifications.md` に詳細仕様を記述
3. **ブランチ作成**: `feature/機能名` または `fix/修正内容`
4. **テスト作成**: 実装予定機能のテストを先に作成
5. **実装**: テストが通るように実装
6. **テスト実行**: 全テストが通ることを確認
7. **プルリクエスト**: 仕様書との整合性もレビュー対象
8. **マージ**: レビュー承認後、mainブランチにマージ

### 7. 禁止事項

- **仕様書なしの実装**: 仕様書の事前更新なしに実装を開始してはいけません
- **テストなしの実装**: テストコードなしに新機能を実装してはいけません
- **console.log の本番残留**: デバッグ用コードは本番に含めてはいけません
- **ハードコードの値**: 設定値は環境変数や設定ファイルで管理してください
- **巨大ファイル**: 1ファイルが200行を超える場合は分割を検討してください

---

**これらのルールは必ず遵守してください。違反した場合は、該当部分の修正を求めます。**

最新更新: 2025年9月28日