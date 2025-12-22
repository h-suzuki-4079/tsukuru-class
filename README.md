This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. 依存関係のインストール

```bash
npm install
```

Supabase関連のパッケージとOpenAI SDKもインストールしてください：

```bash
npm install @supabase/supabase-js @supabase/ssr openai
```

### 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API (推奨 - 実際のAI生成を使用)
# 設定しない場合は、モック関数が使用されます
OPENAI_API_KEY=your_openai_api_key

# OpenAI モデル選択 (オプション)
# デフォルトは gpt-4o-mini (コスト効率が良い)
# 他の選択肢: gpt-3.5-turbo, gpt-4o など
OPENAI_MODEL=gpt-4o-mini
```

### 3. Supabaseのセットアップ

1. Supabaseプロジェクトを作成
2. SQLエディタで `generated_ideas` テーブルを作成（プロジェクトルートのSQLファイルを参照）
3. 認証を有効化

### 4. 開発サーバーの起動

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. アプリケーションの使用

- 未ログイン状態でアクセスすると、自動的に `/login` ページにリダイレクトされます
- サインアップまたはログイン後、`/dashboard` に遷移します
- Week 1では「拡張案ジェネレーター」機能が利用できます

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
