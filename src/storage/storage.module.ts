import { Global, Module } from '@nestjs/common';
import { STORAGE_SERVICE } from './storage.interface';
import { LocalStorageService } from './local-storage.service';
import { SupabaseStorageService } from './supabase-storage.service';

@Global()
@Module({
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass:
        process.env.STORAGE_PROVIDER === 'local'
          ? LocalStorageService
          : SupabaseStorageService,
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
