import { Inject } from "@nestjs/common";
import { couchBaseFunctions } from "./db-query.service";
import { CommonService } from "@portal/common/common.service";

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
        // this inject is used to inject commonService
        Inject(CommonService)(target, "commonService")
        descriptor.value = async function ({ ...args }: any) {
            const defaultOptions = {
                ...args,
                ...names,
                services: this.commonService
            }
            switch (key) {
                case ("shb"):
                    _return = await couchBaseFunctions(defaultOptions);
                    break;
                default:
                    break;
            }
            return _return
        };
    };
}