import { googlePayload } from "src/google/types"

export const getMutationQuery = (finalPayload: googlePayload): string => {
  const mutation: string = `
        mutation {
          AUTH_SVC_AUTH_SVC_googleRegistration(input: {
            email: "${finalPayload?.email}",
            userName: "${finalPayload.userName}",
            lastName: "${finalPayload.lastName}",
            firstName: "${finalPayload.firstName}",
            isOtpVerified: ${finalPayload.isOtpVerified},
            isGoogleAuthUser: ${finalPayload.isGoogleAuthUser},
            isDeleted: ${finalPayload.isDeleted},
            role: ${finalPayload.role},
            createdAt: "${finalPayload.createdAt}",
            updatedAt: "${finalPayload.updatedAt}"
          }) {
            error
            message
            status
            token
          }
        }
      `
  return mutation
}

export const getSessionQuery = (token: string) => {
  const sessionQuery: string = `
      query {
        AUTH_SVC_AUTH_SVC_getSessionById(input: {id: "${token}"}) {
          userData {
            contactNumber
            email
            firstName
            gender
            id
            lastName
            role
            userId
          }
          status
          message
          error
        }
      }
    `;
  return sessionQuery
}