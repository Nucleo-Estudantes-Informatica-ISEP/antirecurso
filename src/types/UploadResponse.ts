export interface UploadResponse {
  id: string;
  contentType: string;
  target: string;
  maxSize: number;
  expires: Date;
  url: string;
  uploadMode?: 'raw-put' | 'supabase-signed-put';
  headers: {
    [key: string]: string;
  };
}
