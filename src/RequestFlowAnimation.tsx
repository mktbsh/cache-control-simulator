import type React from "react";
import { useState } from "react";
import { CACHE_DIRECTIVES } from "./core/const";
import type { SelectedDirectives } from "./core/selected-directives";

interface RequestFlowAnimationProps {
  selectedDirectives: SelectedDirectives;
}

const MAX_STEPS = 4;

function getStepDescription(
  currentStep: number,
  selectedDirectives: SelectedDirectives
) {
  if (selectedDirectives["no-store"]) {
    return "no-storeが設定されているため、毎回新しいリクエストがサーバーに送信されます。";
  }

  if (selectedDirectives["no-cache"]) {
    switch (currentStep) {
      case 1:
        return "リクエストがキャッシュに到達します。no-cacheディレクティブにより、必ず検証が行われます。";
      case 2:
        return "キャッシュがサーバーに検証リクエストを送ります。If-None-MatchやIf-Modified-Sinceヘッダーを使用します。";
      case 3:
        return "サーバーが応答します。変更がなければ304 Not Modified、変更があれば200 OKと新しいコンテンツを返します。";
      case 4:
        return "キャッシュからクライアントに応答が返されます。検証済みのコンテンツが提供されます。";
      default:
        return "";
    }
  }

  switch (currentStep) {
    case 1:
      return "初回リクエスト：クライアントからサーバーにリクエストが送信され、レスポンスがキャッシュに保存されます。";
    case 2:
      return "キャッシュにリクエスト：次回のリクエストはキャッシュに送られます。max-age内であればキャッシュから直接提供されます。";
    case 3:
      return "キャッシュからコンテンツを提供：ネットワーク通信を削減し、高速に応答します。";
    case 4:
      return selectedDirectives["stale-while-revalidate"]
        ? "バックグラウンドで再検証：古いコンテンツを表示しながら、バックグラウンドでキャッシュが更新されます。"
        : "キャッシュから直接提供：有効期限内のコンテンツをキャッシュから提供します。";
    default:
      return "";
  }
}

const RequestFlowAnimation: React.FC<RequestFlowAnimationProps> = ({
  selectedDirectives,
}) => {
  const [step, setStep] = useState<number>(1);

  // アニメーションステップを進める
  const nextStep = () => {
    setStep((prev) => (prev < MAX_STEPS ? prev + 1 : 1));
  };

  // no-storeの場合の特別な処理
  if (selectedDirectives[CACHE_DIRECTIVES.noStore]) {
    return (
      <div
        className="bg-white p-6 rounded-xl shadow-md mb-8"
        role="tabpanel"
        id="panel-animation"
        aria-labelledby="tab-animation"
      >
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          リクエストフローアニメーション
        </h3>

        {/* スクリーンリーダー用説明 */}
        <div className="sr-only" aria-live="polite">
          {getStepDescription(step, selectedDirectives)}
        </div>

        <div
          className="relative w-full max-w-md h-64 border border-gray-200 rounded-lg mx-auto mb-4"
          aria-hidden="true"
        >
          {/* クライアント */}
          <div className="absolute left-4 bottom-4 w-20 h-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <span className="mt-1 text-xs">クライアント</span>
          </div>

          {/* サーバー */}
          <div className="absolute right-4 bottom-4 w-20 h-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xl">🖧</span>
            </div>
            <span className="mt-1 text-xs">サーバー</span>
          </div>

          {/* リクエスト矢印 */}
          <svg className="absolute inset-0 w-full h-full">
            <title>arrow</title>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#EF4444" />
              </marker>
            </defs>
            <line
              x1="50"
              y1="200"
              x2="350"
              y2="200"
              stroke="#EF4444"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          </svg>

          <div className="absolute top-4 left-0 right-0 text-center">
            <p className="text-sm font-medium text-red-600">
              毎回新しいリクエストが発生
            </p>
            <p className="text-xs text-gray-500 mt-2">
              no-storeディレクティブが設定されているため
              <br />
              キャッシュは使用されません
            </p>
          </div>
        </div>

        {/* テキスト説明（アクセシビリティ向上のため） */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
          <h4 className="font-medium mb-1">フローの説明:</h4>
          <p>{getStepDescription(step, selectedDirectives)}</p>
        </div>

        <button
          type="button"
          onClick={nextStep}
          className="mt-2 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="リクエストをシミュレート"
        >
          リクエストをシミュレート
        </button>
      </div>
    );
  }

  if (selectedDirectives[CACHE_DIRECTIVES.noCache]) {
    return (
      <div
        className="bg-white p-6 rounded-xl shadow-md mb-8"
        role="tabpanel"
        id="panel-animation"
        aria-labelledby="tab-animation"
      >
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          リクエストフローアニメーション
        </h3>

        {/* スクリーンリーダー用説明 */}
        <div className="sr-only" aria-live="polite">
          ステップ {step} / {MAX_STEPS}:{" "}
          {getStepDescription(step, selectedDirectives)}
        </div>

        <div
          className="relative w-full max-w-md h-64 border border-gray-200 rounded-lg mx-auto mb-4"
          aria-hidden="true"
        >
          {/* クライアント */}
          <div className="absolute left-4 bottom-4 w-20 h-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <span className="mt-1 text-xs">クライアント</span>
          </div>

          {/* キャッシュ */}
          <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 w-20 h-20 flex flex-col items-center justify-center">
            <div
              className={`w-12 h-12 rounded-full ${
                step >= 2 ? "bg-yellow-100" : "bg-gray-100"
              } flex items-center justify-center`}
            >
              <span className="text-xl">💾</span>
            </div>
            <span className="mt-1 text-xs">キャッシュ</span>
          </div>

          {/* サーバー */}
          <div className="absolute right-4 bottom-4 w-20 h-20 flex flex-col items-center justify-center">
            <div
              className={`w-12 h-12 rounded-full ${
                step >= 3 ? "bg-green-100" : "bg-gray-100"
              } flex items-center justify-center`}
            >
              <span className="text-xl">🖧</span>
            </div>
            <span className="mt-1 text-xs">サーバー</span>
          </div>

          {/* SVG アニメーション */}
          <svg className="absolute inset-0 w-full h-full">
            <title>animation</title>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
              </marker>
            </defs>

            {/* ステップ1: クライアント→キャッシュ */}
            <line
              x1="50"
              y1="200"
              x2="200"
              y2="200"
              stroke={step >= 1 ? "#3B82F6" : "#E5E7EB"}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              className={step === 1 ? "animate-pulse" : ""}
            />

            {/* ステップ2: キャッシュ→サーバー検証 */}
            <line
              x1="200"
              y1="200"
              x2="350"
              y2="200"
              stroke={step >= 2 ? "#3B82F6" : "#E5E7EB"}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              className={step === 2 ? "animate-pulse" : ""}
            />

            {/* ステップ3: サーバー→キャッシュ応答 */}
            <line
              x1="350"
              y1="180"
              x2="200"
              y2="180"
              stroke={step >= 3 ? "#10B981" : "#E5E7EB"}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              className={step === 3 ? "animate-pulse" : ""}
            />

            {/* ステップ4: キャッシュ→クライアント応答 */}
            <line
              x1="200"
              y1="180"
              x2="50"
              y2="180"
              stroke={step >= 4 ? "#10B981" : "#E5E7EB"}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              className={step === 4 ? "animate-pulse" : ""}
            />
          </svg>

          <div className="absolute top-4 left-0 right-0 text-center px-2">
            <p className="text-sm font-medium">
              {step === 1
                ? "リクエストがキャッシュに到達"
                : step === 2
                ? "キャッシュがサーバーに検証リクエスト"
                : step === 3
                ? "サーバーが応答（変更なし/新しいコンテンツ）"
                : "キャッシュからクライアントに応答"}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {step === 1
                ? "no-cacheディレクティブにより、必ず検証が行われます"
                : step === 2
                ? "If-None-MatchやIf-Modified-Sinceヘッダーを使用"
                : step === 3
                ? "304 Not Modified または 200 OKを返す"
                : "検証済みのコンテンツを提供"}
            </p>
          </div>
        </div>

        {/* テキスト説明（アクセシビリティ向上のため） */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
          <h4 className="font-medium mb-1">
            ステップ {step} / {MAX_STEPS}:
          </h4>
          <p>{getStepDescription(step, selectedDirectives)}</p>
        </div>

        <button
          type="button"
          onClick={nextStep}
          className="mt-2 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={
            step < MAX_STEPS ? "次のステップへ進む" : "最初のステップに戻る"
          }
        >
          {step < MAX_STEPS ? "次のステップ" : "最初に戻る"}
        </button>
      </div>
    );
  }

  // 通常のキャッシュフロー
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md mb-8"
      role="tabpanel"
      id="panel-animation"
      aria-labelledby="tab-animation"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        リクエストフローアニメーション
      </h3>

      {/* スクリーンリーダー用説明 */}
      <div className="sr-only" aria-live="polite">
        ステップ {step} / {MAX_STEPS}:{" "}
        {getStepDescription(step, selectedDirectives)}
      </div>

      <div
        className="relative w-full max-w-md h-64 border border-gray-200 rounded-lg mx-auto mb-4"
        aria-hidden="true"
      >
        {/* クライアント */}
        <div className="absolute left-4 bottom-4 w-20 h-20 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <span className="mt-1 text-xs">クライアント</span>
        </div>

        {/* キャッシュ */}
        <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 w-20 h-20 flex flex-col items-center justify-center">
          <div
            className={`w-12 h-12 rounded-full ${
              step >= 2 ? "bg-yellow-100" : "bg-gray-100"
            } flex items-center justify-center`}
          >
            <span className="text-xl">💾</span>
          </div>
          <span className="mt-1 text-xs">キャッシュ</span>
        </div>

        {/* サーバー */}
        <div className="absolute right-4 bottom-4 w-20 h-20 flex flex-col items-center justify-center">
          <div
            className={`w-12 h-12 rounded-full ${
              step === 1 ? "bg-green-100" : "bg-gray-100"
            } flex items-center justify-center`}
          >
            <span className="text-xl">🖧</span>
          </div>
          <span className="mt-1 text-xs">サーバー</span>
        </div>

        {/* SVG アニメーション */}
        <svg className="absolute inset-0 w-full h-full">
          <title>animation</title>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
            </marker>
          </defs>

          {/* 初回リクエスト時のフロー */}
          {step === 1 && (
            <>
              {/* クライアント→サーバー */}
              <line
                x1="50"
                y1="200"
                x2="350"
                y2="200"
                stroke="#3B82F6"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className="animate-pulse"
              />

              {/* サーバー→キャッシュ保存 */}
              <line
                x1="350"
                y1="180"
                x2="200"
                y2="180"
                stroke="#10B981"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                strokeDasharray="5,5"
              />

              {/* サーバー→クライアント応答 */}
              <line
                x1="350"
                y1="170"
                x2="50"
                y2="170"
                stroke="#10B981"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            </>
          )}

          {/* キャッシュヒット時のフロー */}
          {step >= 2 && (
            <>
              {/* クライアント→キャッシュ */}
              <line
                x1="50"
                y1="200"
                x2="200"
                y2="200"
                stroke="#3B82F6"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className={step === 2 ? "animate-pulse" : ""}
              />

              {/* キャッシュ→クライアント */}
              <line
                x1="200"
                y1="180"
                x2="50"
                y2="180"
                stroke="#10B981"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className={step === 3 ? "animate-pulse" : ""}
              />
            </>
          )}

          {/* キャッシュ期限切れでもstale-while-revalidateの場合 */}
          {step === 4 && selectedDirectives["stale-while-revalidate"] && (
            <>
              {/* キャッシュ→サーバー バックグラウンド検証 */}
              <line
                x1="200"
                y1="160"
                x2="350"
                y2="160"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
                className="animate-pulse"
              />

              {/* サーバー→キャッシュ 更新 */}
              <line
                x1="350"
                y1="140"
                x2="200"
                y2="140"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
              />
            </>
          )}
        </svg>

        <div className="absolute top-4 left-0 right-0 text-center px-2">
          <p className="text-sm font-medium">
            {step === 1
              ? "初回リクエスト：サーバーから取得"
              : step === 2
              ? "キャッシュにリクエスト"
              : step === 3
              ? "キャッシュからコンテンツを提供"
              : "バックグラウンドで再検証（stale-while-revalidate）"}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {step === 1
              ? "レスポンスがキャッシュに保存されます"
              : step === 2
              ? "max-age内であればキャッシュから直接提供"
              : step === 3
              ? "ネットワーク通信を削減、高速に応答"
              : "古いコンテンツを表示しながら、バックグラウンドで更新"}
          </p>
        </div>
      </div>

      {/* テキスト説明（アクセシビリティ向上のため） */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
        <h4 className="font-medium mb-1">
          ステップ {step} / {MAX_STEPS}:
        </h4>
        <p>{getStepDescription(step, selectedDirectives)}</p>
      </div>

      <button
        type="button"
        onClick={nextStep}
        className="mt-2 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={
          step < MAX_STEPS ? "次のステップへ進む" : "最初のステップに戻る"
        }
      >
        {step < MAX_STEPS ? "次のステップ" : "最初に戻る"}
      </button>
    </div>
  );
};

export default RequestFlowAnimation;
