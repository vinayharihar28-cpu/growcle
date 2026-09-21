import DataLoader from "dataloader";
import { db } from "./db";

export const memberLoader = new DataLoader(async (ids: readonly string[]) => {
  const members = await db.member.findMany({ where: { id: { in: ids as string[] } } });
  const map = new Map(members.map((m: any) => [m.id, m]));
  return ids.map((id) => map.get(id as string) || null);
});
