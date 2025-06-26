import { DynamicModule, Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { CommonModule, CommonService } from '@portal/common';
import { CqrsModule } from '@nestjs/cqrs';
import { queryHandler } from './query/handler';

@Module({
  imports: [CqrsModule],
  controllers: [GoogleController],
  providers: [GoogleService, ...queryHandler],
})
export class RootGoogleModule { }

export class GoogleModule {
  static forRootAsync({ svcName }): DynamicModule {
    return {
      module: RootGoogleModule,
      imports: [CommonModule.forRoot({ svcName })],
      providers: [CommonService],
      exports: [CommonService]
    }
  }
}
