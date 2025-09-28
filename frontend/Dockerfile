# フロントエンド用Dockerfile
FROM node:18-alpine

WORKDIR /app

# package.jsonをコピーして依存関係をインストール
COPY package*.json ./
RUN npm ci && npm cache clean --force

# ソースコードをコピー
COPY . .

# 非rootユーザーで実行
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]