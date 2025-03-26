import type { DirectiveCategory } from "./category";

export interface Directive {
  name: string;
  type: "boolean" | "value";
  description: string;
  conflicts: string[];
  category: DirectiveCategory;
  initial?: string;
}

export const DIRECTIVE_DEFINITIONS: ReadonlyArray<Directive> = [
  {
    name: "max-age",
    type: "value",
    description: "リソースが新鮮と見なされる最大時間（秒）",
    initial: "3600",
    conflicts: ["no-store"],
    category: "freshness",
  },
  {
    name: "no-cache",
    type: "boolean",
    description: "キャッシュを使用する前に必ずオリジンサーバーで検証する",
    conflicts: ["immutable"],
    category: "validation",
  },
  {
    name: "no-store",
    type: "boolean",
    description: "リソースをキャッシュに保存しない",
    conflicts: [
      "max-age",
      "s-maxage",
      "public",
      "private",
      "immutable",
      "must-revalidate",
      "proxy-revalidate",
      "stale-while-revalidate",
      "stale-if-error",
    ],
    category: "storage",
  },
  {
    name: "public",
    type: "boolean",
    description: "共有キャッシュに保存可能",
    conflicts: ["private", "no-store"],
    category: "storage",
  },
  {
    name: "private",
    type: "boolean",
    description: "単一ユーザー用のキャッシュのみに保存可能",
    conflicts: ["public", "no-store"],
    category: "storage",
  },
  {
    name: "must-revalidate",
    type: "boolean",
    description: "期限切れのリソースを使用する前に検証が必要",
    conflicts: ["no-store"],
    category: "validation",
  },
  {
    name: "immutable",
    type: "boolean",
    description: "リソースが更新されることはない",
    conflicts: ["no-cache", "no-store"],
    category: "validation",
  },
  {
    name: "s-maxage",
    type: "value",
    description: "共有キャッシュ用のmax-ageオーバーライド（秒）",
    initial: "7200",
    conflicts: ["no-store"],
    category: "freshness",
  },
  {
    name: "stale-while-revalidate",
    type: "value",
    description: "再検証中に古いコンテンツを提供できる時間（秒）",
    initial: "60",
    conflicts: ["no-store"],
    category: "freshness",
  },
  {
    name: "stale-if-error",
    type: "value",
    description: "エラー時に古いコンテンツを提供できる時間（秒）",
    initial: "300",
    conflicts: ["no-store"],
    category: "freshness",
  },
];

export function getDirectivesByCategory(category: string): Directive[] {
  return DIRECTIVE_DEFINITIONS.filter((d) => d.category === category);
}

export function getDirectiveByName(name: string): Directive | undefined {
  return DIRECTIVE_DEFINITIONS.find((d) => d.name === name);
}
