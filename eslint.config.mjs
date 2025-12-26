import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ✅ 生成物を必ず除外（これが目的）
  {
    ignores: [".next/**", "node_modules/**"],
  },

  // 既存のNext推奨設定
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
