export function ReferenceInfo() {
  return (
    <div
      className="bg-blue-50 p-6 rounded-xl shadow-md border-t-4 border-blue-400"
      role="complementary"
      aria-labelledby="reference-title"
    >
      <h2
        id="reference-title"
        className="text-2xl font-semibold mb-4 text-blue-800 flex items-center"
      >
        <span className="mr-2" aria-hidden="true">
          📚
        </span>
        参照情報
      </h2>
      <p className="mb-3 text-blue-900">
        Cache-Controlヘッダーは、HTTP通信におけるキャッシュの動作を制御する重要な仕組みです。
      </p>
      <p className="mb-3 text-blue-900">
        複数のディレクティブを適切に組み合わせることで、パフォーマンスとリソースの鮮度のバランスを最適化できます。
      </p>
      <p className="text-blue-900">
        詳細は
        <a
          href="https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Cache-Control"
          className="text-blue-700 font-bold hover:underline hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          MDN Web Docs
        </a>
        を参照してください。
      </p>
    </div>
  );
}
