interface D1Prepared {
  first: <T = unknown>() => Promise<T | null>;
  all: <T = unknown>() => Promise<{ results: T[] }>;
  run: () => Promise<unknown>;
}

interface D1Like {
  prepare: (sql: string) => D1Prepared & {
    bind: (...args: unknown[]) => D1Prepared;
  };
}

export function getD1(env: Record<string, unknown>, binding = "DB"): D1Like {
  const db = env[binding];
  if (!db || typeof db !== "object") {
    throw new Error(`D1 binding ${binding} is not configured.`);
  }

  return db as D1Like;
}
