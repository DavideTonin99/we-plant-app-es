export class ImageModel {
  url: string;
  thumbnailUrl: string;
  id: number;
  name: string;
  cratedById: number;
  toUpload: boolean;
  constructor(url) {
    this.url = url;
  }
}
