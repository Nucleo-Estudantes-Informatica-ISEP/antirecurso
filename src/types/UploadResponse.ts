export interface UploadResponse {
  id: string;
  contentType: string;
  target: string;
  maxSize: number;
  expires: Date;
  url: string;
  headers: {
    [key: string]: string;
  };
}
