import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IStorageService } from './storage.interface';
import type { File as MulterFile } from 'multer';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService implements IStorageService {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    this.bucket = process.env.SUPABASE_STORAGE_BUCKET!;
  }

  async upload(file: MulterFile, folder: string): Promise<string> {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    const filePath = `${folder}/${unique}.${ext}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (error) throw new InternalServerErrorException(`Storage upload failed: ${error.message}`);

    const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async delete(fileUrl: string): Promise<void> {
    // URL format: .../storage/v1/object/public/{bucket}/{path}
    const match = fileUrl.match(/\/object\/public\/[^/]+\/(.+)$/);
    if (!match) return;

    await this.supabase.storage.from(this.bucket).remove([match[1]]);
  }
}
