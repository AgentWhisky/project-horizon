export function getRuntimeMs(start: string | Date | null, end: string | Date | null): number {
  if (!start || !end) {
    return 0;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  return endDate.getTime() - startDate.getTime();
}
