export const CACHE_DIRECTIVES = {
  public: "public",
  private: "private",
  immutable: "immutable",
  noCache: "no-cache",
  noStore: "no-store",
  maxAge: "max-age",
  sMaxAge: "s-maxage",
  mustRevalidate: "must-revalidate",
  swr: "stale-while-revalidate",
  sie: "stale-if-error",
} as const;
