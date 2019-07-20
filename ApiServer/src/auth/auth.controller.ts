import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService, LoginResponse, AccessPermit } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() reqBody: {signedPermit: string, ethAddress: string}): Promise<LoginResponse> {
    return this.authService.login(reqBody.signedPermit, reqBody.ethAddress.toLowerCase());
  }

  @Post('permit')
  @HttpCode(200)
  async generatePermitResponse(@Body() reqBody: {ethAddress: string}): Promise<AccessPermit> {
    return this.authService.generatePermit(reqBody.ethAddress.toLowerCase());
  }
}
