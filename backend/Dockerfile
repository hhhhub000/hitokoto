# バックエンド用Dockerfile
FROM node:18-alpine

WORKDIR /app

# package.jsonをコピーして依存関係をインストール
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ソースコードをコピー
COPY . .

# TypeScriptをビルド
RUN npm run build

# 非rootユーザーで実行
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# アップロードディレクトリの作成
RUN mkdir -p uploads

EXPOSE 3001

CMD ["npm", "start"]