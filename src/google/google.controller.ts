import { Controller, Get, Query, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { Response } from 'express';
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) { }

  @Get("/callback")
  async callBack(@Query("code") code: any, @Res() res: Response) {
    try {
      const userData = await this.googleService.googleCallBack(code)
      res.cookie('userData', userData, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
      res.redirect('https://portal-web-app.netlify.app/dashboard')
    }
    catch (err: any) {
      console.log("err", err)
      res.status(400).json({ data: [], error: err?.message })

    }
  }
}
