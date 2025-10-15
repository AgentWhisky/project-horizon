/**
 * Extracts the filename from a Content-Disposition header if available
 * @param headerValue The full Content-Disposition header value
 * @param defaultName Optional default filename to return if none is found.
 * @returns The extracted filename, the defaultName if provided, or null if none found.
 *
 *  - RFC 2183: filename="example.txt"
 *  - RFC 5987: filename*=UTF-8''example.txt
 */
export function extractFilenameFromContentDisposition(headerValue: string | null, defaultName: string): string {
  if (!headerValue) {
    return defaultName;
  }

  // Try to match RFC 5987 encoded filename
  const encodedMatch = headerValue.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (encodedMatch) {
    try {
      return decodeURIComponent(encodedMatch[1]);
    } catch {
      return encodedMatch[1];
    }
  }

  // Try to match RFC 2183 encoded filename
  const match = headerValue.match(/filename\s*=\s*(?:"([^"]+)"|([^;]+))/i);
  return match?.[1] ?? match?.[2]?.trim() ?? defaultName;
}
