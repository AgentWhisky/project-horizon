export function generateEventAppend(message: string): () => string {
  return () => `array_append(events, '${generateEventMessage(message)}')`;
}

export function generateEventMessage(message: string): string {
  return `${new Date().toISOString()} - ${message}`;
}
