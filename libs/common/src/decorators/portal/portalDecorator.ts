import { Inject } from "@nestjs/common";
import { couchBaseFunctions } from "./db-query.service";
import { CommonService } from "../../common.service";

export const portal = (names?: any): PropertyDecorator => {
    return _portal(names)
};

const _portal = (names?: any): PropertyDecorator => {
    return (
        target: object,
        key?: string,
        descriptor?: TypedPropertyDescriptor<any>
    ) => {
        let _return: any;

        Inject(CommonService)(target, "commonService")
        descriptor.value = async function ({ ...args }: any) {
            const defaultOptions = {
                ...args,
                services: this.commonService
            }
            switch (key) {
                case ("shb"):
                    _return = await couchBaseFunctions(defaultOptions);
                    break;
            }
            return _return
        };
    };
}