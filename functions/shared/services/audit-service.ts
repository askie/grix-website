import { getD1 } from "../db/client";

export async function writeAuditLog(
  env: Record<string, unknown>,
  data: {
    actorEmail: string;
    action: string;
    targetType: string;
    targetId?: string;
    payload?: Record<string, unknown>;
  }
): Promise<void> {
  const db = getD1(env);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO audit_logs (id, actor_email, action, target_type, target_id, payload_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      data.actorEmail,
      data.action,
      data.targetType,
      data.targetId ?? null,
      data.payload ? JSON.stringify(data.payload) : null,
      now
    )
    .run();
}
