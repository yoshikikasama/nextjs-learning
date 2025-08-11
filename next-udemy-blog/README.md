# Next.js Blog Application

UdemyのNext.js フルスタック講座で作成したブログアプリケーションです。

## 📚 ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [🏗️ アーキテクチャ](./docs/ARCHITECTURE.md) | システム構成、技術仕様、処理フロー図 |
| [⚙️ 開発環境セットアップ](./docs/SETUP.md) | ローカル開発環境の構築手順 |
| [🚀 デプロイメント](./docs/DEPLOYMENT.md) | Supabase & Vercel本番環境構築 |

## 🛠️ 技術スタック

- **Framework**: Next.js 15.1.1
- **Auth**: NextAuth.js 5.0
- **Database**: Prisma + SQLite (開発) / PostgreSQL (本番)
- **Storage**: Supabase
- **UI**: Radix UI + Tailwind CSS
- **Validation**: Zod

## ⚡ クイックスタート

```bash
# プロジェクト複製
git clone git@github.com:aokitashipro/next-udemy-blog.git
cd next-udemy-blog

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env

# データベース設定
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 開発サーバー起動
npm run dev
```

## 📁 プロジェクト構成

```
next-udemy-blog/
├── docs/                 # 📚 技術ドキュメント
├── src/
│   ├── app/             # 🎯 App Router
│   │   ├── (auth)/      # 🔐 認証ルート
│   │   ├── (private)/   # 🏠 管理画面
│   │   └── (public)/    # 🌐 公開ページ
│   ├── components/      # 🧩 UIコンポーネント
│   ├── lib/            # ⚙️ サーバーアクション
│   └── types/          # 📝 型定義
├── prisma/             # 🗄️ データベース
└── public/             # 📁 静的ファイル
```

## 🌟 主要機能

- ✅ ユーザー認証（登録・ログイン）
- ✅ ブログ投稿CRUD機能
- ✅ Markdownエディター
- ✅ 画像アップロード（Supabase）
- ✅ レスポンシブデザイン
- ✅ SEO最適化

## 📞 サポート

詳細な技術情報は [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) をご参照ください。