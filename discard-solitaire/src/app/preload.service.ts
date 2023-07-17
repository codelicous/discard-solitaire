import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreloadService {
  private images: HTMLImageElement[] = [];

  public preloadImages(urls: string[]): void {
    for (const url of urls) {
      const img = new Image();
      img.src = url;
      this.images.push(img);
    }
  }
}
