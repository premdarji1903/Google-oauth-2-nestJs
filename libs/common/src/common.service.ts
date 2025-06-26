
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CouchbaseService } from './couchbase/couchbase.service';
import axios from 'axios'
const inst = {
  svcName: undefined
}
@Injectable()
export class CommonService {
  kafka?: any
  couchbase?: any
  constructor(
    readonly couchbaseService?: CouchbaseService,
    @Inject("svcName") readonly svcName?: string
  ) {
    if (this.svcName) {
      inst.svcName = this.svcName
    }
  }
  getRandomId(len: number = 8): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  getCbService() {
    try {
      return this.couchbaseService
    }
    catch (err) {
      Logger.error("Error occured in getCbService func--->", err?.message)
    }
  }
  getSvcName(svcName?: string) {
    return inst.svcName ?? svcName
  }
  async callAxiosApi(url?: string, options?: any) {
    try {
      const response = await axios.post(
        url ?? process.env.AUTH_SVC_URL,
        {
          query: options?.query
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response
    }
    catch (err) {
      Logger.error(`Error ${err?.message} occured while calling this api -->`, url)
    }
  }
}