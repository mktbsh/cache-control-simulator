import type React from "react";
import { useState } from "react";
import { CACHE_DIRECTIVES } from "./core/const";
import type { SelectedDirectives } from "./core/selected-directives";

interface Props {
  selectedDirectives: SelectedDirectives;
}

const MAX_TIME = 100;

export function CacheFlowVisualizer({ selectedDirectives }: Props) {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  const maxAge = selectedDirectives[CACHE_DIRECTIVES.maxAge]
    ? Number.parseInt(selectedDirectives[CACHE_DIRECTIVES.maxAge] as string)
    : 3600;

  const sMaxAge = selectedDirectives[CACHE_DIRECTIVES.sMaxAge]
    ? Number.parseInt(selectedDirectives[CACHE_DIRECTIVES.sMaxAge] as string)
    : null;

  const staleWhileRevalidate = selectedDirectives[CACHE_DIRECTIVES.swr]
    ? Number.parseInt(selectedDirectives[CACHE_DIRECTIVES.swr] as string)
    : null;

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeElapsed(Number.parseInt(e.target.value));
  };

  // 現在の状態を判定
  const getCacheStatus = (): string => {
    if (selectedDirectives[CACHE_DIRECTIVES.noStore]) {
      return CACHE_DIRECTIVES.noStore;
    }

    const maxAgePercentage = (maxAge / 3600) * 50; // max-ageを50%までのスケールに変換
    // TODO: UI作成
    const _sMaxAgePercentage = sMaxAge ? (sMaxAge / 3600) * 50 : null;
    const swrPercentage = staleWhileRevalidate
      ? (staleWhileRevalidate / 3600) * 25
      : null;

    if (timeElapsed < maxAgePercentage) {
      return "fresh";
    }

    if (
      staleWhileRevalidate &&
      timeElapsed < maxAgePercentage + (swrPercentage || 0)
    ) {
      return "stale-revalidating";
    }

    return "expired";
  };

  // 再検証が必要かどうか
  const needsRevalidation = () => {
    if (selectedDirectives["no-cache"]) {
      return true; // 常に再検証
    }

    const status = getCacheStatus();
    return (
      status === "expired" ||
      (status === "stale-revalidating" && selectedDirectives["must-revalidate"])
    );
  };

  const status = getCacheStatus();

  // 状態の表示名を取得する
  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "no-cache":
        return "キャッシュなし";
      case "fresh":
        return "フレッシュ";
      case "stale-revalidating":
        return "再検証中";
      case "expired":
        return "期限切れ";
      default:
        return status;
    }
  };

  // アクセシビリティのために状態の説明を取得
  const getStatusDescription = (status: string) => {
    switch (status) {
      case "no-cache":
        return "キャッシュなし: 毎回サーバーから取得します。";
      case "fresh":
        return "フレッシュ: キャッシュされたコンテンツを直接提供できます。";
      case "stale-revalidating":
        return "再検証中: 古いコンテンツを表示しながらバックグラウンドで更新します。";
      case "expired":
        return "期限切れ: 使用前にサーバーでの再検証が必要です。";
      default:
        return "";
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md mb-8"
      role="tabpanel"
      id="panel-timeline"
      aria-labelledby="tab-timeline"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        キャッシュライフサイクルのシミュレーション
      </h3>

      {/* 現在の状態の説明（スクリーンリーダー用） */}
      <div className="sr-only" aria-live="polite">
        現在の状態: {getStatusDisplayName(status)}。
        {getStatusDescription(status)}
        経過時間: {timeElapsed}％
      </div>

      {/* 時間スライダー */}
      <div className="mb-6">
        <label
          htmlFor="time-slider"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          経過時間: {timeElapsed}%
        </label>
        <input
          id="time-slider"
          type="range"
          min="0"
          max={MAX_TIME}
          value={timeElapsed}
          onChange={handleTimeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          aria-valuemin={0}
          aria-valuemax={MAX_TIME}
          aria-valuenow={timeElapsed}
          aria-valuetext={`${timeElapsed}パーセント経過`}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>リクエスト発生</span>
          <span>時間経過</span>
        </div>
      </div>

      {/* ネットワーク図 */}
      <div
        className="relative h-64 mb-6 border border-gray-200 rounded-lg p-4"
        aria-hidden="true" // ビジュアル図はスクリーンリーダーから隠す（代替テキストを上部に提供）
      >
        {/* ブラウザ */}
        <div className="absolute left-4 top-4 w-24 h-24 flex flex-col items-center justify-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              status === CACHE_DIRECTIVES.noCache
                ? "bg-gray-200"
                : status === "fresh"
                ? "bg-green-100 border-2 border-green-500"
                : status === "stale-revalidating"
                ? "bg-yellow-100 border-2 border-yellow-500"
                : "bg-red-100 border-2 border-red-500"
            }`}
          >
            <span className="text-2xl">🖥️</span>
          </div>
          <span className="mt-2 text-sm font-medium">ブラウザ</span>
          {status !== "no-cache" && (
            <span
              className={`text-xs mt-1 px-2 py-1 rounded-full ${
                status === "fresh"
                  ? "bg-green-100 text-green-800"
                  : status === "stale-revalidating"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {getStatusDisplayName(status)}
            </span>
          )}
        </div>

        {/* CDN/共有キャッシュ */}
        <div className="absolute left-1/2 top-4 transform -translate-x-1/2 w-24 h-24 flex flex-col items-center justify-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              selectedDirectives[CACHE_DIRECTIVES.public]
                ? sMaxAge && timeElapsed < (sMaxAge / 3600) * 50
                  ? "bg-green-100 border-2 border-green-500"
                  : "bg-gray-200"
                : "bg-gray-100 opacity-50"
            }`}
          >
            <span className="text-2xl">🌐</span>
          </div>
          <span className="mt-2 text-sm font-medium">CDN</span>
          {selectedDirectives[CACHE_DIRECTIVES.public] && sMaxAge && (
            <span
              className={`text-xs mt-1 px-2 py-1 rounded-full ${
                timeElapsed < (sMaxAge / 3600) * 50
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {timeElapsed < (sMaxAge / 3600) * 50 ? "フレッシュ" : "期限切れ"}
            </span>
          )}
        </div>

        {/* サーバー */}
        <div className="absolute right-4 top-4 w-24 h-24 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
            <span className="text-2xl">🖧</span>
          </div>
          <span className="mt-2 text-sm font-medium">サーバー</span>
        </div>

        {/* 接続線 */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <title>Cache Flow Visualization</title>
          {/* ブラウザ→CDN線 */}
          <line
            x1="40"
            y1="40"
            x2="200"
            y2="40"
            stroke={needsRevalidation() ? "#EF4444" : "#9CA3AF"}
            strokeWidth="2"
            strokeDasharray={needsRevalidation() ? "5,5" : "0"}
          />

          {/* CDN→サーバー線 */}
          <line
            x1="200"
            y1="40"
            x2="360"
            y2="40"
            stroke={
              selectedDirectives["no-cache"] ||
              (selectedDirectives["must-revalidate"] && status === "expired")
                ? "#EF4444"
                : "#9CA3AF"
            }
            strokeWidth="2"
            strokeDasharray={
              selectedDirectives["no-cache"] ||
              (selectedDirectives["must-revalidate"] && status === "expired")
                ? "5,5"
                : "0"
            }
          />

          {/* 流れを示す矢印 */}
          {status !== "no-cache" && status !== "expired" && (
            <polygon
              points="195,35 205,40 195,45"
              fill="#9CA3AF"
              transform={needsRevalidation() ? "rotate(180 200 40)" : ""}
            />
          )}

          {status === "no-cache" || needsRevalidation() ? (
            <polygon points="355,35 365,40 355,45" fill="#EF4444" />
          ) : null}
        </svg>

        {/* 説明テキスト */}
        <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-gray-700">
          {getStatusDescription(status)}
        </div>
      </div>

      {/* タイムライン */}
      <div className="relative h-16 mb-4">
        <div className="absolute inset-x-0 top-8 h-2 bg-gray-200 rounded" />

        {/* max-age マーカー */}
        {maxAge && (
          <div
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${(maxAge / 3600) * 50}%` }}
          >
            <div className="h-12 w-px bg-green-600" />
            <div className="h-4 w-4 rounded-full bg-green-600 -mt-2" />
            <span className="mt-1 text-xs text-green-800 whitespace-nowrap">
              max-age: {maxAge}秒
            </span>
          </div>
        )}

        {/* s-maxage マーカー */}
        {sMaxAge && (
          <div
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${(sMaxAge / 3600) * 50}%` }}
          >
            <div className="h-12 w-px bg-blue-600" />
            <div className="h-4 w-4 rounded-full bg-blue-600 -mt-2" />
            <span className="mt-1 text-xs text-blue-800 whitespace-nowrap">
              s-maxage: {sMaxAge}秒
            </span>
          </div>
        )}

        {/* stale-while-revalidate マーカー */}
        {staleWhileRevalidate && (
          <div
            className="absolute top-0 flex flex-col items-center"
            style={{
              left: `${
                (maxAge / 3600) * 50 + (staleWhileRevalidate / 3600) * 25
              }%`,
            }}
          >
            <div className="h-12 w-px bg-yellow-600" />
            <div className="h-4 w-4 rounded-full bg-yellow-600 -mt-2" />
            <span className="mt-1 text-xs text-yellow-800 whitespace-nowrap">
              stale-while-revalidate: {staleWhileRevalidate}秒
            </span>
          </div>
        )}

        {/* 現在位置マーカー */}
        <div
          className="absolute top-4 h-10 w-px bg-red-600"
          style={{ left: `${timeElapsed}%` }}
        >
          <div className="h-4 w-4 rounded-full bg-red-600 -ml-2 -mt-2" />
        </div>
      </div>

      {/* アクセシビリティのための説明テキスト */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
        <h4 className="font-medium mb-2">タイムラインの説明:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {maxAge && (
            <li>max-age ({maxAge}秒): レスポンスが新鮮と見なされる最大時間</li>
          )}
          {sMaxAge && (
            <li>
              s-maxage ({sMaxAge}秒): 共有キャッシュでの最大フレッシュ時間
            </li>
          )}
          {staleWhileRevalidate && (
            <li>
              stale-while-revalidate ({staleWhileRevalidate}秒):
              max-age期限切れ後も表示可能な時間
            </li>
          )}
          <li>
            現在の経過時間: {timeElapsed}% (
            {status === "fresh"
              ? "フレッシュな状態"
              : status === "stale-revalidating"
              ? "再検証中の状態"
              : "期限切れの状態"}
            )
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CacheFlowVisualizer;
