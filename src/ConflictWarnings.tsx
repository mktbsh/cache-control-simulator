interface Props {
  conflicts: string[];
}

export function ConflictWarnings({ conflicts }: Props) {
  if (conflicts.length === 0) {
    return null;
  }

  return (
    <div
      className="mb-8 p-5 bg-red-50 rounded-xl shadow-lg border-l-4 border-red-500 animate-pulse"
      role="alert"
      aria-labelledby="conflicts-title"
    >
      <h2
        id="conflicts-title"
        className="text-2xl font-semibold mb-3 text-red-700 flex items-center"
      >
        <span className="mr-2" aria-hidden="true">
          ⚠️
        </span>
        競合の警告!
      </h2>
      <ul
        className="list-disc pl-5 space-y-1"
        aria-label="検出された競合のリスト"
      >
        {conflicts.map((conflict) => (
          <li key={conflict} className="text-red-800 font-medium">
            {conflict}
          </li>
        ))}
      </ul>
    </div>
  );
}
