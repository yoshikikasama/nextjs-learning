# Deployment Guide - Next.js Blog

本番環境へのデプロイメント手順書

## Supabase設定手順

### 1. Supabaseプロジェクト作成
```bash
# 1. https://supabase.com にアクセス
# 2. "New project" をクリック
# 3. Organization選択 & Project名入力
# 4. Database password設定
# 5. Region選択（推奨: Northeast Asia (Tokyo)）
```

### 2. Supabase Storage設定
```sql
-- 1. Supabase Dashboard > Storage > "New bucket"
-- 2. Bucket名: "blog-images" 
-- 3. Public bucket: ON
-- 4. File size limit: 50MB
-- 5. Allowed MIME types: image/jpeg,image/png,image/webp,image/gif
```

### 3. Storage Policy設定
```sql
-- Supabase Dashboard > Storage > blog-images > Policies

-- ファイルアップロード許可（認証ユーザーのみ）
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- ファイル参照許可（全ユーザー）
CREATE POLICY "Allow public access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- ファイル削除許可（所有者のみ）
CREATE POLICY "Allow users to delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. 環境変数取得
```bash
# Supabase Dashboard > Settings > API
# 必要な値をコピー：
# - Project URL
# - Project API keys > anon public
# - Project API keys > service_role (secret)
```

## Vercel設定手順

### 1. GitHub連携
```bash
# 1. https://vercel.com にアクセス
# 2. "Import Git Repository" 選択
# 3. GitHubリポジトリを選択
# 4. Import project
```

### 2. ビルド設定
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### 3. 環境変数設定
```bash
# Vercel Dashboard > Settings > Environment Variables

# Database (本番用PostgreSQL推奨)
DATABASE_URL=postgresql://username:password@hostname:port/database

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Production flag
NEXT_PUBLIC_USE_SUPABASE_STORAGE=true
```

### 4. カスタムドメイン設定（オプション）
```bash
# Vercel Dashboard > Settings > Domains
# 1. Add Domain
# 2. DNS設定（CNAMEレコード追加）
# 3. SSL証明書自動発行
```

## PostgreSQL移行手順

### 1. 本番データベース準備
```bash
# 推奨プロバイダー：
# - Supabase Database
# - Railway
# - PlanetScale  
# - Neon
# - Vercel Postgres
```

### 2. Prisma設定更新
```javascript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // sqlite から変更
  url      = env("DATABASE_URL")
}
```

### 3. マイグレーション実行
```bash
# 本番DBマイグレーション
npx prisma migrate deploy

# 本番環境でのシード実行（必要に応じて）
npx prisma db seed
```

## セキュリティ設定

### 1. セキュリティヘッダー設定
```javascript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

### 2. 環境変数セキュリティ
```bash
# 本番環境でのベストプラクティス：
# 1. 強力なパスワード生成
npx auth secret

# 2. 定期的なシークレット更新
# 3. 最小権限の原則
# 4. 監査ログの有効化
```

## モニタリング設定

### 1. Vercel Analytics
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. エラーモニタリング
```bash
# Sentry統合（オプション）
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## パフォーマンス最適化

### 1. 画像最適化
```javascript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-project.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  }
}
```

### 2. Bundle分析
```bash
# Bundle Analyzer
npm install --save-dev @next/bundle-analyzer

# 分析実行
ANALYZE=true npm run build
```

## トラブルシューティング

### よくある問題と解決策

#### ビルドエラー
```bash
# Type errors
npm run type-check

# ESLint errors  
npm run lint --fix

# Missing dependencies
npm install --legacy-peer-deps
```

#### データベース接続エラー
```bash
# Connection string確認
npx prisma db push

# SSL設定確認（PostgreSQL）
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
```

#### 認証エラー
```bash
# NextAuth設定確認
# NEXTAUTH_URL が正しい本番URLになっているか確認
# NEXTAUTH_SECRET が設定されているか確認
```

## デプロイメント チェックリスト

### 本番環境移行前確認
- [ ] すべての環境変数が設定済み
- [ ] データベースマイグレーション完了
- [ ] 本番用データベース接続確認
- [ ] Supabase Storage設定完了  
- [ ] セキュリティヘッダー設定
- [ ] カスタムドメイン設定（必要に応じて）
- [ ] SSL証明書有効
- [ ] 画像アップロード機能テスト
- [ ] 認証フロー動作確認
- [ ] パフォーマンステスト実行

### 運用開始後確認
- [ ] エラーモニタリング設定
- [ ] アクセス解析設定
- [ ] 定期バックアップ設定
- [ ] ログ監視設定
- [ ] パフォーマンス監視設定

---

この手順書に従って、安全で高パフォーマンスな本番環境を構築してください。