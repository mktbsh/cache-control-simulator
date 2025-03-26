import { useMemo } from "react";
import { BehaviorVisualizer } from "./CacheBehaviorVisualizer";
import { ConflictWarnings } from "./ConflictWarnings";
import { DirectiveSelector } from "./DirectiveSelector";
import { HeaderOutput } from "./HeaderOutput";
import { ReferenceInfo } from "./ReferenceInfo";
import { computeBehaviors } from "./core/cache-behavior";
import {
  detectConflicts,
  generateHeaderString,
} from "./core/selected-directives";
import { useDirectives } from "./core/use-directives";

export function App() {
  const { selectedDirectives, handleChangeDirective } = useDirectives();

  const [header, conflicts, behaviors] = useMemo(
    () => [
      generateHeaderString(selectedDirectives),
      detectConflicts(selectedDirectives),
      computeBehaviors(selectedDirectives),
    ],
    [selectedDirectives]
  );

  return (
    <main className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center border-b-4 border-blue-500 pb-4">
        Cache-Control Simulator
      </h1>

      {/* スクリーンリーダー向けの説明 */}
      <div className="sr-only">
        このツールは、Cache-Controlヘッダーのディレクティブを組み合わせた時の挙動を視覚的に学ぶためのものです。
        ディレクティブを選択すると、対応するキャッシュの動作が表示されます。
      </div>

      <HeaderOutput header={header} />
      <ConflictWarnings conflicts={conflicts} />
      <DirectiveSelector
        selectedDirectives={selectedDirectives}
        onDirectiveChange={handleChangeDirective}
      />
      <BehaviorVisualizer
        behaviors={behaviors}
        selectedDirectives={selectedDirectives}
      />
      <ReferenceInfo />

      {/* スキップリンク - キーボードユーザー向け */}
      <a
        href="#directives-section-title"
        className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-blue-600 focus:text-white focus:z-50 focus:top-4 focus:left-4 focus:rounded"
      >
        ディレクティブ選択へスキップ
      </a>
    </main>
  );
}
