import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  /**
   * Download a file from a given Blob
   * @param file The Blob containing the file to download
   * @param filename The filename of the file to download
   */
  downloadFile(file: Blob, filename: string) {
    // Sanitize filename
    const safeName = filename.replace(/[\\/:*?"<>|]/g, '_');

    // Create element and add to DOM
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(file);

    a.href = objectUrl;
    a.download = safeName;
    a.style.display = 'none';
    document.body.appendChild(a);

    // Trigger download event
    a.click();

    // Remove element from DOM
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  /**
   * Download a JSON file from locally generated data
   * @param data The JSON data to download
   * @param filename The filename of the JSON file
   */
  downloadJson(data: unknown, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const safeFilename = filename.endsWith('.json') ? filename : `${filename}.json`;

    this.downloadFile(blob, safeFilename);
  }

  /**
   * Download a text file from locally generated data
   * @param content The content of the text file
   * @param fileName The filename of the text file
   * @param mimeType The mimeType of the text file
   */
  downloadText(content: string, fileName: string, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    this.downloadFile(blob, fileName);
  }
}
