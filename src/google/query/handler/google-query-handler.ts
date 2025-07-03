import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GoogleQueryImpl } from "../impl";
import { Logger } from "@nestjs/common";
import { CommonService, GOOGLE_ACCESS_TOKEN_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URL, RoleEnum } from "@portal/common";
import { getMutationQuery, getSessionQuery } from "../query-mutation";
import { googlePayload } from "../../types";
@QueryHandler(GoogleQueryImpl)
export class GoogleQueryHandler implements IQueryHandler<GoogleQueryImpl> {
    constructor(private readonly commonService: CommonService) { }
    async execute(query: GoogleQueryImpl): Promise<any> {
        try {
            const { payload } = query
            const token_info_response = await this.getGoogleInformation(payload)
            if (token_info_response?.email_verified == "true") {
                const { email, given_name, family_name } = token_info_response

                const finalPayload: googlePayload = {
                    email,
                    userName: family_name,
                    lastName: given_name,
                    firstName: family_name,
                    isOtpVerified: true,
                    isGoogleAuthUser: true,
                    isDeleted: false,
                    role: RoleEnum.USER,
                    createdAt: new Date()?.toISOString(),
                    updatedAt: new Date()?.toISOString(),
                }

                const response = await this.commonService.callAxiosApi(process.env.AUTH_SVC_URL, {
                    query: getMutationQuery(finalPayload),
                })
                const token = await response?.data?.data?.AUTH_SVC_AUTH_SVC_googleRegistration?.token
                // const userData = await this.getSessionToken(token)
                return token
            }
        }
        catch (err) {
            Logger.error("Error occured inside the Google query handler--->", err?.message)
        }
    }
    async getGoogleInformation(code: string) {
        try {
            const data = {
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: REDIRECT_URL,
                grant_type: "authorization_code",
            };
            const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
                method: "POST",
                body: JSON.stringify(data),
            });

            const access_token_data = await response.json();
            const { id_token } = access_token_data;
            let token_info_response: any = await fetch(
                `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
            );
            token_info_response = await token_info_response?.json()
            return token_info_response
        }
        catch (err) {
            Logger.error("Error occured inside the getGoogleInformation--> ", err?.message)
        }
    }

    async getSessionToken(token: string) {
        try {
            const sessionResponse = await this.commonService.callAxiosApi(process.env.AUTH_SVC_URL, {
                query: getSessionQuery(token),
            })
            const userData = sessionResponse?.data?.data?.AUTH_SVC_AUTH_SVC_getSessionById?.userData
            return userData ?? {}
        }
        catch (err) {
            Logger.error("Error occured inside the session data--------->", err?.message)
        }
    }
}