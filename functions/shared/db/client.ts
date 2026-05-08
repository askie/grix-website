interface D1Like {
  prepare: (sql: string) => {
    bind: (...args: unknown[]) => {
      first: <T = unknown>() => Promise<T | null>;
      all: <T = unknown>() => Promise<{ results: T[] }>;
      run: () => Promise<unknown>;
    };
  };
}

export function getD1(env: Record<string, unknown>, binding = "DB"): D1Like {
  const db = env[binding];
  if (!db || typeof db !== "object") {
    throw new Error(`D1 binding ${binding} is not configured.`);
  }

  return db as D1Like;
}
