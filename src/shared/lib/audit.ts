import { db } from "./db";

export async function auditLog({ who, action, entity, entityId, oldValue, newValue, ip, ua }: {
  who?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  ip?: string | null;
  ua?: string | null;
}) {
  try {
    await db.auditLog.create({ data: { who: who ?? undefined, action, entity, entityId: entityId ?? undefined, oldValue: oldValue ?? undefined, newValue: newValue ?? undefined, ipAddress: ip ?? undefined, userAgent: ua ?? undefined } });
  } catch (err) {
    console.error("Failed to write audit log", err);
  }
}
