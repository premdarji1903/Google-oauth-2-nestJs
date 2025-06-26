import { DynamicModule, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule } from '@nestjs/config';
import { CouchbaseModule } from './couchbase/couchbase.module';
import { CouchbaseService } from './couchbase/couchbase.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [CommonService, { provide: "svcName", useValue: undefined }],
  exports: [CommonService, "svcName"]
})
export class RootCommonModule { }

export class CommonModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RootCommonModule,
    };
  }
  static forRoot(options?: any): DynamicModule {
    return {
      module: RootCommonModule,
      imports: [
        CouchbaseModule.forRootAsync(options?.svcName)],
      providers: [CouchbaseService, { provide: "svcName", useValue: options?.svcName }],
      exports: [CouchbaseService, { provide: "svcName", useValue: options?.svcName }]
    };
  }
}
