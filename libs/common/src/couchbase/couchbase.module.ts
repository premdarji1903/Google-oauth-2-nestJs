import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CouchbaseService } from './couchbase.service';

@Module({
  providers: [
    { provide: "svcName", useValue: undefined }, CouchbaseService
  ],
  exports: ["svcName", CouchbaseService]
})
export class RootCouchbaseModule { }

@Module({})
export class CouchbaseModule {
  static async forRootAsync(svcName?: string): Promise<DynamicModule> {
    return {
      module: RootCouchbaseModule,
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        { provide: "svcName", useValue: svcName }, CouchbaseService, ConfigService
      ],
      exports: ["svcName", CouchbaseService, ConfigService]
    }
  }
}
