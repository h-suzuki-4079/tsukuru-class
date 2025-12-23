-- entries テーブル作成SQL
-- SupabaseのSQLエディタで実行してください

CREATE TABLE IF NOT EXISTS entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  current_state TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- インデックスの作成（検索・管理用）
CREATE INDEX IF NOT EXISTS idx_entries_email ON entries(email);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);

-- RLS (Row Level Security) の設定
-- 管理者のみがデータを閲覧できるようにする場合
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- ポリシー: 認証済みユーザーのみがデータを閲覧可能（必要に応じて調整）
-- 注意: このポリシーは、管理者がSupabaseダッシュボードから直接データを確認できるようにするためのものです
-- フォーム送信は匿名でも可能にする場合は、INSERTポリシーを追加してください

CREATE POLICY "Allow authenticated users to read entries"
  ON entries
  FOR SELECT
  TO authenticated
  USING (true);

-- 匿名ユーザーでもINSERTできるようにする（フォーム送信用）
CREATE POLICY "Allow anonymous users to insert entries"
  ON entries
  FOR INSERT
  TO anon
  WITH CHECK (true);




