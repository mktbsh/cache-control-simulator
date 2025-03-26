import { useState } from "react";
import { CacheBehaviorTabs } from "./CacheBehaviorTabs";
import CacheFlowVisualizer from "./CacheFlowVisualizer";
import RequestFlowAnimation from "./RequestFlowAnimation";
import type { CacheBehavior } from "./core/cache-behavior";
import type { SelectedDirectives } from "./core/selected-directives";

interface Props {
  behaviors: CacheBehavior[];
  selectedDirectives: SelectedDirectives;
}

export function BehaviorVisualizer({ behaviors, selectedDirectives }: Props) {
  const [viewMode, setViewMode] = useState<"cards" | "timeline" | "animation">(
    "cards"
  );

  return (
    <section
      className="mb-12 bg-white p-6 rounded-xl shadow-lg"
      aria-labelledby="behaviors-section-title"
    >
      <h2
        id="behaviors-section-title"
        className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2 flex items-center"
      >
        <span className="mr-2" aria-hidden="true">
          📊
        </span>
        動作の視覚化
      </h2>

      {/* 表示モード切り替えタブ */}
      <CacheBehaviorTabs activeTab={viewMode} onChange={setViewMode} />

      {/* カード表示モード */}
      {viewMode === "cards" && (
        <div role="tabpanel" id="panel-cards" aria-labelledby="tab-cards">
          {behaviors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {behaviors.map((behavior) => (
                <div
                  key={behavior.title}
                  className="p-5 bg-gradient-to-r from-white to-gray-50 rounded-lg border-l-4 border-blue-400 shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3" aria-hidden="true">
                      {behavior.icon}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800">
                      {behavior.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 bg-white p-3 rounded-md shadow-inner">
                    {behavior.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <span className="block text-4xl mb-3" aria-hidden="true">
                👆
              </span>
              <p className="text-gray-600 italic text-lg">
                ディレクティブを選択して動作を確認してください。
              </p>
            </div>
          )}
        </div>
      )}

      {/* タイムライン表示モード */}
      {viewMode === "timeline" && behaviors.length > 0 && (
        <CacheFlowVisualizer selectedDirectives={selectedDirectives} />
      )}

      {/* アニメーション表示モード */}
      {viewMode === "animation" && behaviors.length > 0 && (
        <RequestFlowAnimation selectedDirectives={selectedDirectives} />
      )}

      {/* スクリーンリーダー向けの説明 */}
      {behaviors.length > 0 && (
        <div className="sr-only">
          <h3>選択されたディレクティブの動作:</h3>
          <ul>
            {behaviors.map((behavior) => (
              <li key={behavior.title}>
                {behavior.title}: {behavior.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
