export function getRuntime(start: string | Date | null, end?: string | Date | null, unit: 'ms' | 's' = 'ms'): number | null {
  if (!start || !end) {
    return null;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();

  return unit === 's' ? Math.floor(diff / 1000) : diff;
}
