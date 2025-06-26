import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as couchbase from "couchbase"
@Injectable()
export class CouchbaseService {
  private readonly client = {}
  private svcName: string
  init: (svcName: string) => void;
  constructor(private readonly configService?: ConfigService) {
    this.init = async (svcName: string) => {
      if (svcName) {
        console.log({ username: this.configService.get(`${svcName}_COUCHBASE_USERNAME`), password: this.configService.get(`${svcName}_COUCHBASE_PASSWORD`), })
        this.svcName = svcName,
          this.client[svcName] = await couchbase.connect(this.configService.get("COUCHBASE_URL"), {
            username: this.configService.get(`${svcName}_COUCHBASE_USERNAME`),
            password: this.configService.get(`${svcName}_COUCHBASE_PASSWORD`),
          });
        return this.client[svcName]
      }
    }
  }
  async query(bucketName: string, scopeName: string, query: string) {
    try {
      const bucket = this.client[this.svcName].bucket(bucketName);
      const scope = bucket.scope(scopeName);
      return await scope.query(query);
    } catch (e) {
      Logger.error('Error occurred in CouchBase query------->', e);
      throw e;
    }
  }
  async get(bucketName: string, scopeName: string, collectioName: string, id: string) {
    try {
      return this.client[this.svcName].bucket(bucketName).scope(scopeName).collection(collectioName).get(id)
    }
    catch (e) {
      Logger.error('Error occurred in CouchBase query------->', e);
      throw e;
    }
  }
  async touch(bucketName: string, scopeName: string, collectioName: string, id: string,
    time: number,) {
    try {
      return this.client[this.svcName].bucket(bucketName).scope(scopeName).collection(collectioName).touch(id, time)
    }
    catch (e) {
      Logger.error('Error occurred in CouchBase touch------->', e);
      throw e;
    }
  }
  async create(bucketName: string, scopeName: string, collectioName: string, id: string, payload: any, ttlInSeconds?: number) {
    try {
      const collection = this.client[this.svcName].bucket(bucketName).scope(scopeName).collection(collectioName)
      return collection.insert(id, payload, { expiry: ttlInSeconds });
    }
    catch (e) {
      Logger.error('Error occurred in CouchBase create------->', e);
      throw e;
    }
  }
  async ftsSearch(indexName: any, couchbaseQuery: any, options?: any) {
    try {
      return this.client[this.svcName].searchQuery(indexName, couchbaseQuery, options);
    }
    catch (e) {
      Logger.error('Error occurred in CouchBase create------->', e);
      throw e;
    }
  }
}
