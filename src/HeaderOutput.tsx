interface Props {
  header: string;
}

export function HeaderOutput({ header }: Props) {
  return (
    <div
      className="mb-8 p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-500"
      aria-labelledby="header-output-title"
    >
      <h2
        id="header-output-title"
        className="text-2xl font-semibold mb-3 text-blue-700 flex items-center"
      >
        <span className="mr-2" aria-hidden="true">
          📋
        </span>
        ヘッダー出力:
      </h2>
      <div
        className="bg-gray-800 p-4 rounded-md font-mono text-white text-lg shadow-inner"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="sr-only">生成されたCache-Controlヘッダー: </span>
        Cache-Control: {header || "<ディレクティブを選択してください>"}
      </div>
    </div>
  );
}
