import { IQuery } from "@nestjs/cqrs";

export class GoogleQueryImpl implements IQuery {
    constructor(readonly payload: any) { }
}