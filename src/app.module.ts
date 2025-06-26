import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleModule } from './google/google.module';
import { svcList } from '@portal/common';

@Module({
  imports: [GoogleModule?.forRootAsync({ svcName: svcList.AUTH_SVC })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
