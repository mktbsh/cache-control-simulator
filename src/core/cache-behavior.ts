import { CACHE_DIRECTIVES } from "./const";
import type { SelectedDirectives } from "./selected-directives";

export interface CacheBehavior {
  title: string;
  description: string;
  icon: string;
}

export function computeBehaviors(
  selectedDirectives: SelectedDirectives
): CacheBehavior[] {
  const behaviors: CacheBehavior[] = [];

  if (selectedDirectives[CACHE_DIRECTIVES.noStore]) {
    behaviors.push({
      title: "キャッシュなし",
      description:
        "リソースはキャッシュに保存されません。毎回新しいリクエストが発生します。",
      icon: "🚫",
    });
    return behaviors;
  }

  if (selectedDirectives[CACHE_DIRECTIVES.public]) {
    behaviors.push({
      title: "共有キャッシュに保存可能",
      description:
        "CDNや中間キャッシュなどの共有キャッシュにリソースを保存できます。",
      icon: "🌐",
    });
  } else if (selectedDirectives[CACHE_DIRECTIVES.private]) {
    behaviors.push({
      title: "プライベートキャッシュのみ",
      description:
        "ブラウザなどの単一ユーザーのキャッシュにのみリソースを保存できます。",
      icon: "🔒",
    });
  }

  const maxAgeDirective = selectedDirectives[CACHE_DIRECTIVES.maxAge];
  if (maxAgeDirective) {
    const maxAge = Number.parseInt(maxAgeDirective as string);
    behaviors.push({
      title: `${maxAge}秒間フレッシュ`,
      description: `リソースは${maxAge}秒間、再検証なしで使用できます。`,
      icon: "⏱️",
    });
  }

  const sMaxAgeDirective = selectedDirectives[CACHE_DIRECTIVES.sMaxAge];
  if (sMaxAgeDirective) {
    const sMaxAge = Number.parseInt(sMaxAgeDirective as string);
    behaviors.push({
      title: `共有キャッシュで${sMaxAge}秒間フレッシュ`,
      description: `共有キャッシュでは、リソースが${sMaxAge}秒間フレッシュとみなされます（max-ageよりも優先）。`,
      icon: "🌍",
    });
  }

  if (selectedDirectives[CACHE_DIRECTIVES.noCache]) {
    behaviors.push({
      title: "常に再検証",
      description:
        "キャッシュされますが、使用前に毎回サーバーで検証が必要です。",
      icon: "🔄",
    });
  }

  if (selectedDirectives[CACHE_DIRECTIVES.mustRevalidate]) {
    behaviors.push({
      title: "期限切れ時に再検証必須",
      description:
        "max-ageの期限が切れた後、キャッシュされたリソースを使用する前に再検証が必要です。",
      icon: "⚠️",
    });
  }

  if (selectedDirectives[CACHE_DIRECTIVES.immutable]) {
    behaviors.push({
      title: "不変リソース",
      description:
        "リソースは変更されないため、再検証リクエストは送信されません。",
      icon: "🔒",
    });
  }

  const swrDirective = selectedDirectives[CACHE_DIRECTIVES.swr];
  if (swrDirective) {
    const swr = Number.parseInt(swrDirective as string);
    behaviors.push({
      title: `再検証中の古いコンテンツ許容（${swr}秒）`,
      description: `max-ageの期限が切れた後も、${swr}秒間は古いコンテンツを表示しながらバックグラウンドで再検証します。`,
      icon: "🔄",
    });
  }

  const sieDirective = selectedDirectives[CACHE_DIRECTIVES.sie];
  if (sieDirective) {
    const sie = Number.parseInt(sieDirective as string);
    behaviors.push({
      title: `エラー時の古いコンテンツ許容（${sie}秒）`,
      description: `再検証リクエストが失敗した場合、${sie}秒間は古いコンテンツを表示できます。`,
      icon: "🛠️",
    });
  }

  return behaviors;
}
