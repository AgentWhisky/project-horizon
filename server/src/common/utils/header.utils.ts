/**
 * Builds a Content-Disposition header value
 * @param filename The filename to include in the header
 * @param disposition The disposition type, defaults to 'attachment'
 * @returns A properly formatted Content-Disposition header string
 *
 * Includes:
 * - RFC 2183: filename="example.txt"
 * - RFC 5987: filename*=UTF-8''example.txt
 *
 */
export function getContentDispositionHeader(filename: string, disposition: 'attachment' | 'inline' = 'attachment') {
  if (!filename) {
    throw new Error('No filename provided');
  }

  const encodedFileName = encodeURIComponent(filename);
  return `${disposition}; filename="${filename}"; filename*=UTF-8''${encodedFileName}`;
}
