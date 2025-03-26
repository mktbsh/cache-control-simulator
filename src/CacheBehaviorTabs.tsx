type TabKey = "cards" | "timeline" | "animation";

interface TabConfig {
  key: TabKey;
  label: string;
}

interface BehaviorTabsProps {
  activeTab: TabKey;
  onChange: (tabKey: TabKey) => void;
}

const tabs: TabConfig[] = [
  { key: "cards", label: "カード表示" },
  { key: "timeline", label: "タイムライン" },
  { key: "animation", label: "アニメーション" },
];

export function CacheBehaviorTabs({ activeTab, onChange }: BehaviorTabsProps) {
  return (
    <div
      className="flex border-b border-gray-200 mb-6"
      role="tablist"
      aria-label="動作の視覚化タブ"
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          type="button"
          aria-selected={activeTab === tab.key}
          aria-controls={`panel-${tab.key}`}
          id={`tab-${tab.key}`}
          className={`py-2 px-4 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            activeTab === tab.key
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
