import { getCategories, getCategoryDisplayName } from "./core/category";
import { type Directive, getDirectivesByCategory } from "./core/directive";
import type { SelectedDirectives } from "./core/selected-directives";

interface Props {
  selectedDirectives: SelectedDirectives;
  onDirectiveChange: (directive: Directive, value: string | boolean) => void;
}

export function DirectiveSelector({
  selectedDirectives,
  onDirectiveChange,
}: Props) {
  const categories = getCategories();

  return (
    <section
      className="mb-12 bg-white p-6 rounded-xl shadow-lg"
      aria-labelledby="directives-section-title"
    >
      <h2
        id="directives-section-title"
        className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2 flex items-center"
      >
        <span className="mr-2" aria-hidden="true">
          🔧
        </span>
        ディレクティブを選択
      </h2>

      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h3
            id={`category-${category}`}
            className="text-lg font-semibold mb-4 text-gray-700 inline-block bg-gray-100 px-4 py-1 rounded-full"
          >
            {getCategoryDisplayName(category)}
          </h3>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="group"
            aria-labelledby={`category-${category}`}
          >
            {getDirectivesByCategory(category).map((directive) => (
              <div
                key={directive.name}
                className={`p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 ${
                  selectedDirectives[directive.name] !== undefined
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "bg-white border border-gray-200 hover:border-blue-200"
                }`}
              >
                <div className="flex items-start mb-3">
                  {directive.type === "boolean" ? (
                    <div className="relative inline-block w-10 mr-3 align-middle select-none">
                      <input
                        type="checkbox"
                        id={directive.name}
                        checked={selectedDirectives[directive.name] === true}
                        onChange={(e) =>
                          onDirectiveChange(directive, e.target.checked)
                        }
                        className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
                        style={{
                          top: "0px",
                          left:
                            selectedDirectives[directive.name] === true
                              ? "4px"
                              : "-4px",
                          transition: "left 0.2s",
                        }}
                        aria-describedby={`desc-${directive.name}`}
                      />
                      {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                      <label
                        htmlFor={directive.name}
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          selectedDirectives[directive.name] === true
                            ? "bg-blue-600"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      id={`${directive.name}-value`}
                      value={
                        (selectedDirectives[directive.name] as string) ||
                        directive.initial
                      }
                      onChange={(e) =>
                        onDirectiveChange(directive, e.target.value)
                      }
                      placeholder={directive.initial}
                      className="w-24 mr-3 px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label={`${directive.name}の値`}
                      aria-describedby={`desc-${directive.name}`}
                    />
                  )}
                  <label
                    htmlFor={
                      directive.type === "boolean"
                        ? directive.name
                        : `${directive.name}-value`
                    }
                    className="font-bold text-lg text-gray-800"
                  >
                    {directive.name}
                  </label>
                </div>
                <p
                  id={`desc-${directive.name}`}
                  className="text-sm text-gray-700 bg-gray-50 p-2 rounded"
                >
                  {directive.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
