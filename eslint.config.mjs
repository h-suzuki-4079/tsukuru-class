import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ✅ 生成物を除外
  { ignores: [".next/**", "node_modules/**"] },

  // Next推奨（先に読み込む）
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ 例外は “最後” に置いて上書き勝ちさせる
  {
    files: ["app/actions/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
