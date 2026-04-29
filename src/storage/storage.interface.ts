import type { File as MulterFile } from 'multer';

export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export interface IStorageService {
  upload(file: MulterFile, folder: string): Promise<string>;
  delete(fileUrl: string): Promise<void>;
}
