export function cursorPaginate({
  items,
  limit,
  getCursor,
}: {
  items: any[];
  limit: number;
  getCursor: (item: any) => string;
}) {
  const nextCursor = items.length === limit ? getCursor(items[items.length - 1]) : null;
  return { items, nextCursor };
}
