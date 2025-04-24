import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor() {}

  downloadFile(file: Blob, fileName: string) {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(file);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}
