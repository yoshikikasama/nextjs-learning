# Next.js Blog Application Documentation

## プロジェクト概要

Next.js 15とNextAuth.js 5.0を使用した高機能ブログアプリケーション。認証機能、投稿管理、Markdown対応、画像アップロード機能を備えた完全なブログシステム。

## アーキテクチャ構成図

### システム全体構成
```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React Components] --> B[Route Groups]
        B --> C[(auth) - Authentication]
        B --> D[(private) - Dashboard]  
        B --> E[(public) - Blog]
    end

    subgraph "Authentication Layer"
        F[NextAuth.js 5.0] --> G[Credentials Provider]
        F --> H[Session Management]
        F --> I[Middleware Protection]
    end

    subgraph "Business Logic Layer"
        J[Server Actions] --> K[Form Validation]
        J --> L[Data Operations]
        K --> M[Zod Schemas]
    end

    subgraph "Data Layer"
        N[Prisma ORM] --> O[(SQLite Database)]
        P[Supabase] --> Q[Image Storage]
    end

    subgraph "UI Framework"
        R[Tailwind CSS] --> S[Custom Styling]
        T[Radix UI] --> U[Accessible Components]
        V[Lucide Icons] --> W[Icon System]
    end

    A --> F
    C --> F
    D --> I
    E --> J
    J --> N
    A --> T
    A --> R
```

### Route Groups構成
```mermaid
graph TD
    A[src/app] --> B[(auth)]
    A --> C[(private)]
    A --> D[(public)]
    
    B --> E[layout.tsx - Auth Layout]
    B --> F[login/page.tsx]
    B --> G[register/page.tsx]
    
    C --> H[layout.tsx - Private Layout]
    C --> I[dashboard/page.tsx]
    C --> J[manage/posts/...]
    
    D --> K[layout.tsx - Public Layout]
    D --> L[page.tsx - Home]
    D --> M[posts/[id]/page.tsx]
    
    J --> N[create/page.tsx]
    J --> O[[id]/page.tsx - Post Detail]
    J --> P[[id]/edit/page.tsx]
```

## データベース設計

### ERD (Entity Relationship Diagram)
```mermaid
erDiagram
    User ||--o{ Post : creates
    
    User {
        string id PK "cuid()"
        string name "ユーザー名"
        string email UK "メールアドレス"
        string password "ハッシュ化パスワード"
        datetime createdAt "作成日時"
        datetime updatedAt "更新日時"
    }
    
    Post {
        string id PK "cuid()"
        string title "投稿タイトル"
        string content "投稿内容(Markdown)"
        string topImage "アイキャッチ画像URL"
        boolean published "公開状態"
        string authorId FK "作成者ID"
        datetime createdAt "作成日時"
        datetime updatedAt "更新日時"
    }
```

### データベース制約
- **User.email**: UNIQUE制約
- **Post.authorId**: User.idへの外部キー (CASCADE DELETE)
- **Post.published**: デフォルト値 true

## 認証フロー

### ユーザー登録・ログインフロー
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as NextAuth
    participant SA as Server Action  
    participant DB as Database

    Note over U,DB: ユーザー登録フロー
    U->>F: 登録フォーム送信
    F->>SA: createUser Action
    SA->>SA: パスワードハッシュ化 (bcrypt)
    SA->>DB: ユーザー作成
    DB-->>SA: 作成結果
    SA-->>F: 登録完了
    F-->>U: ログインページへリダイレクト

    Note over U,DB: ログインフロー
    U->>F: ログインフォーム送信
    F->>A: signIn (credentials)
    A->>SA: authenticate Action
    SA->>DB: ユーザー検証
    DB-->>SA: ユーザー情報
    SA->>SA: パスワード検証
    SA-->>A: 認証結果
    A-->>F: セッション作成
    F-->>U: ダッシュボードへリダイレクト
```

### 認証保護フロー
```mermaid
sequenceDiagram
    participant U as User
    participant M as Middleware
    participant A as NextAuth
    participant P as Protected Page

    U->>M: プロテクトされたルートへアクセス
    M->>A: セッション確認
    
    alt セッション有効
        A-->>M: 有効なセッション
        M-->>P: アクセス許可
        P-->>U: プロテクトされたコンテンツ表示
    else セッション無効
        A-->>M: 無効/期限切れセッション
        M-->>U: /loginへリダイレクト
    end
```

## ブログ投稿管理フロー

### 投稿作成フロー
```mermaid
sequenceDiagram
    participant U as User
    participant F as Form
    participant SA as Server Action
    participant V as Validation
    participant S as Supabase
    participant DB as Database

    U->>F: 投稿作成フォーム
    F->>SA: createPost Action
    
    SA->>V: バリデーション (Zod)
    alt バリデーション成功
        V->>SA: 有効なデータ
        
        opt 画像アップロード
            SA->>S: 画像アップロード
            S-->>SA: 画像URL
        end
        
        SA->>DB: 投稿作成
        DB-->>SA: 作成結果
        SA-->>F: 成功レスポンス
        F-->>U: 投稿詳細ページへリダイレクト
        
    else バリデーションエラー
        V-->>SA: エラー情報
        SA-->>F: エラーレスポンス
        F-->>U: エラーメッセージ表示
    end
```

### 投稿編集・削除フロー
```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant SA as Server Action
    participant DB as Database
    participant S as Supabase

    Note over U,S: 投稿編集フロー
    U->>C: 編集ボタンクリック
    C->>SA: updatePost Action
    SA->>DB: 投稿更新
    DB-->>SA: 更新結果
    SA-->>C: 成功レスポンス
    C-->>U: 更新完了通知

    Note over U,S: 投稿削除フロー
    U->>C: 削除ボタンクリック
    C->>C: 確認ダイアログ表示
    U->>C: 削除確認
    C->>SA: deletePost Action
    
    opt 画像削除
        SA->>S: 画像ファイル削除
        S-->>SA: 削除完了
    end
    
    SA->>DB: 投稿削除
    DB-->>SA: 削除結果
    SA-->>C: 成功レスポンス
    C-->>U: 投稿リストへリダイレクト
```

## コンポーネント構成

### UI Components階層
```mermaid
graph TD
    A[RootLayout] --> B[Route Group Layouts]
    
    B --> C[AuthLayout]
    B --> D[PrivateLayout] 
    B --> E[PublicLayout]
    
    D --> F[PrivateHeader]
    D --> G[Setting]
    E --> H[PublicHeader]
    
    F --> I[Navigation Menu]
    G --> J[User Settings]
    
    K[Post Components] --> L[PostCard]
    K --> M[PostDropdownMenu]
    K --> N[DeletePostDialog]
    K --> O[SearchBox]
    
    P[Auth Components] --> Q[LoginForm]
    P --> R[RegisterForm]
    
    S[UI Primitives] --> T[Button]
    S --> U[Input]
    S --> V[Dialog]
    S --> W[Card]
    S --> X[Alert]
```

### Server Actions構成
```mermaid
graph TD
    A[Server Actions] --> B[Authentication]
    A --> C[Post Management]
    A --> D[User Management]
    
    B --> E[authenticate.ts]
    
    C --> F[createPost.ts]
    C --> G[updatePost.ts] 
    C --> H[deletePost.ts]
    
    D --> I[createUser.ts]
    
    J[Validation] --> K[post.ts - Post Schema]
    J --> L[user.ts - User Schema]
    
    M[Utilities] --> N[image.ts - Image Upload]
    M --> O[utils.ts - Common Utils]
    M --> P[prisma.ts - DB Client]
    M --> Q[supabase.ts - Storage Client]
```

## レンダリング戦略

### ページ別レンダリング手法
```mermaid
graph LR
    A[Pages] --> B{Rendering Strategy}
    
    B -->|Static| C[Home Page]
    B -->|Dynamic| D[Post Details] 
    B -->|Server-side| E[Dashboard]
    B -->|Client-side| F[Interactive Forms]
    
    C --> G[Build Time Generation]
    D --> H[Request Time Generation]
    E --> I[Server Components]
    F --> J[Client Components]
    
    style C fill:#e1f5fe
    style D fill:#f3e5f5  
    style E fill:#e8f5e8
    style F fill:#fff3e0
```

### データフェッチング戦略
```mermaid
graph TD
    A[Data Fetching] --> B[Server Components]
    A --> C[Client Components]
    
    B --> D[Direct DB Access]
    B --> E[Server Actions]
    
    C --> F[SWR/React Query]
    C --> G[Form Actions]
    
    D --> H[Prisma Queries]
    E --> I[Form Submissions]
    F --> J[Client-side Cache]
    G --> K[Progressive Enhancement]
```

## 技術仕様

### 開発環境セットアップ
```bash
# プロジェクトセットアップ
cd next-udemy-blog
npm install

# データベースセットアップ
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 開発サーバー起動
npm run dev
```

### 主要依存関係

| カテゴリ | パッケージ | バージョン | 用途 |
|----------|------------|------------|------|
| フレームワーク | Next.js | 15.1.1 | Reactフレームワーク |
| 認証 | NextAuth.js | 5.0.0-beta.25 | 認証システム |
| データベース | Prisma | 6.2.1 | ORM |
| UI | Radix UI | 各種 | アクセシブルコンポーネント |
| スタイリング | Tailwind CSS | 3.4.1 | CSS フレームワーク |
| 画像保存 | Supabase | 2.48.1 | ファイルストレージ |
| バリデーション | Zod | 3.24.1 | スキーマ検証 |
| Markdown | react-markdown | 9.0.3 | Markdownレンダリング |

### 環境変数設定
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

## セキュリティ考慮事項

### 認証セキュリティ
- bcryptjsによるパスワードハッシュ化
- CSRF保護 (NextAuth.js内蔵)
- セッション管理とタイムアウト
- ミドルウェアによるルート保護

### データ保護
- Zodによる入力値検証
- Prismaによる型安全なDB操作  
- SQL injection防止
- XSS対策 (React標準)

### ファイルアップロード
- Supabaseによる安全なファイル保存
- 画像フォーマット検証
- ファイルサイズ制限

## パフォーマンス最適化

### 最適化手法
- App Routerによるコード分割
- Server Componentsの活用
- 画像最適化 (Next.js Image)
- 静的生成の活用

### 監視とデバッグ
- Next.js DevToolsの活用
- Prisma Studio でのデータ確認
- コンソールログの適切な使用

## デプロイメント

### Vercel推奨設定
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### 本番環境考慮事項
- PostgreSQL等の本番DB移行
- 環境変数の適切な設定
- 画像CDN設定
- セキュリティヘッダー設定

---

このドキュメントは、Next.js Blogアプリケーションの包括的な技術文書として、開発・運用・保守の指針を提供します。