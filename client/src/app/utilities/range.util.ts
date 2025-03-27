export function range(start: number, stop?: number, step?: number): number[] {
  if (typeof step === 'undefined') {
    step = stop && start < stop ? 1 : -1;
  }

  if (typeof stop === 'undefined') {
    stop = start;
    start = 0;
  }

  return Array.from({ length: Math.ceil((stop - start) / step) }, (_, i) => start + i * step);
}
