import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { CreateGoogleDto } from './dto/create-google.dto';
import { UpdateGoogleDto } from './dto/update-google.dto';
import { Response } from 'express';
import * as dotenv from 'dotenv'
dotenv.config()
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) { }

  @Get("/callback")
  async callBack(@Query("code") code: any, @Res() res: Response) {
    try {
      console.log("code--------->", code)
      const data = {
        code,

        client_id: GOOGLE_CLIENT_ID,

        client_secret: GOOGLE_CLIENT_SECRET,

        redirect_uri: "http://localhost:3000/google/callback",

        grant_type: "authorization_code",
      };
      const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
        method: "POST",

        body: JSON.stringify(data),
      });

      const access_token_data = await response.json();
      // console.log('access_token_data', access_token_data);
      const { id_token } = access_token_data;

      console.log(id_token);

      // verify and extract the information in the id token

      const token_info_response = await fetch(
        `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
      );
      console.log('token_info_response', await token_info_response.json());

      //  TODO saved the data and call the create session api to generate session and then redirect to the dashboard with token
      res.cookie('token', 'abcd1234', {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        // sameSite: 'Lax', // or 'Strict'
      });

      res.redirect('http://localhost:5173/login')
    }
    catch (err) {
      console.log("err", err)
    }
  }
}
