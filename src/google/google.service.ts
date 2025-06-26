import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GoogleQueryImpl } from './query/impl';

@Injectable()
export class GoogleService {
  constructor(private readonly queryBus: QueryBus) { }
  public async googleCallBack(code: any) {
    return await this.queryBus.execute(new GoogleQueryImpl(code))
  }
}
