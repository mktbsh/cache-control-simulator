import { getDirectiveByName } from "./directive";

export interface SelectedDirectives {
  [name: string]: boolean | string;
}

/**
 * ディレクティブの選択状態からCache-Controlヘッダーを生成
 */
export function generateHeaderString(directives: SelectedDirectives): string {
  return Object.entries(directives)
    .map(([k, v]) => (v === true ? k : `${k}=${v}`))
    .join(", ");
}

export function detectConflicts(directives: SelectedDirectives): string[] {
  const conflicts: string[] = [];

  for (const name of Object.keys(directives)) {
    const directive = getDirectiveByName(name);
    if (!directive) continue;

    for (const conflict of directive.conflicts) {
      if (directives[conflict] !== undefined) {
        conflicts.push(`${name}と${conflict}は互いに競合します`);
      }
    }
  }

  return [...new Set(conflicts)];
}
