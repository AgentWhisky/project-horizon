export function getErrorNameAndMessage(error: unknown): string {
  if (error instanceof Error) {
    return `${error.constructor.name}: ${error.message}`;
  }
  return `NonError: ${String(error)}`;
}
