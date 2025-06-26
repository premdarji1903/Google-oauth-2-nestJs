import { Logger } from '@nestjs/common';
import { Cluster } from 'couchbase';
export const couchBaseFunctions = async (defaultOptions: any) => {
    const bucketName = defaultOptions?.bucketName
    const scopeName = defaultOptions?.scopeName
    try {
        const serviceName: string = defaultOptions?.services?.getSvcName()
        let couchbaseService = await defaultOptions?.services
        couchbaseService = couchbaseService?.getCbService()
        const cbCluster: Cluster = await couchbaseService?.init(serviceName)
        return {
            query: async (
                query: string,
            ): Promise<any> => {
                try {
                    // const bucket = cluster.bucket(bucketName);
                    // const scope = bucket.scope(scopeName);
                    return await couchbaseService.query(bucketName, scopeName, query)
                } catch (e) {
                    Logger.error('Error occurred in CouchBase query------->', e);
                    throw e;
                }
            },
            cluster: cbCluster,
            get: async (
                id: string, collectionname: string
            ): Promise<any> => {
                try {
                    return await couchbaseService.get(bucketName, scopeName, collectionname, id)
                    // return await cluster.bucket(bucketName).scope(scopeName).collection(collectionname).get(id);
                } catch (e) {
                    Logger.error('Error occurred in CouchBase get function------->', e);
                    throw e;
                }
            },

            touch: async (
                id: string,
                time: number,
                collectionName: string
            ): Promise<any> => {
                try {
                    return await couchbaseService.touch(bucketName, scopeName, collectionName, id, time)
                    // const collection = cluster.bucket(bucketName).scope(scopeName).collection(collectionName);
                    // return await collection.touch(id, time);
                } catch (e) {
                    Logger.error('Error occurred in CouchBase touch function------->', e);
                    throw e;
                }
            },

            create: async (
                id: string,
                payload: any,
                collectionName: string,
                ttlInSeconds?: number
            ): Promise<any> => {
                try {
                    return await couchbaseService.create(bucketName, scopeName, collectionName, id, payload, ttlInSeconds)
                    // const collection = cluster.bucket(bucketName).scope(scopeName).collection(collectionName);
                    // return await collection.insert(id, payload, { expiry: ttlInSeconds });
                } catch (e) {
                    Logger.error('Error occurred in CouchBase create function------->', e);
                    throw e;
                }
            },

            ftsSearch: async (indexName: any, couchbaseQuery: any, options?: any) => {
                try {
                    let option: any
                    option = options
                    if (!option) {
                        option = {
                            limit: 10000,
                        };
                    }
                    const result = await couchbaseService.ftsSearch(indexName, couchbaseQuery, option)
                    if (!result?.rows?.length) {
                        return []
                    }
                    return result?.rows?.map((ids: any) => ids?.id)
                } catch (e) {
                    Logger.error('Error occurred in CouchBase touch function------->', e);
                    throw e;
                }
            },
        }

    }
    catch (err) {
        Logger.log("err---->", err);
    }
};

