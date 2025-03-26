const CATEGORIES = ["freshness", "storage", "validation"] as const;

export type DirectiveCategory = (typeof CATEGORIES)[number];

/**
 * 利用可能なカテゴリーを取得
 */
export function getCategories(): ReadonlyArray<DirectiveCategory> {
  return [...CATEGORIES];
}

/**
 * カテゴリー名を日本語表示用に変換する
 * @param category
 * @returns カテゴリの日本語表記
 */
export function getCategoryDisplayName(
  category: DirectiveCategory | (string & {})
): string {
  switch (category) {
    case "freshness":
      return "⏱️ フレッシュネス制御";
    case "storage":
      return "🗄️ ストレージ制御";
    case "validation":
      return "🔄 検証制御";
    default: {
      throw new Error(`Unsupported category: ${category}`);
    }
  }
}
