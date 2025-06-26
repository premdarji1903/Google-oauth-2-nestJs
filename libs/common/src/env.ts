import { config } from 'dotenv'
config()
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;
export const REDIRECT_URL=process.env.NODE_ENV =="DEV" ? process.env.DEV_REDIRECT_URL : process.env.PROD_REDIRECT_URL