import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, Res, Headers, BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';

@ApiTags('登录认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "注册" })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() params: RegisterDto) {
    return this.authService.register(params);
  }

  @ApiOperation({ summary: "登录" })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Body() params: LoginDto) {
    return this.authService.login(params);
  }

  // TODO: 待完成
  @ApiOperation({ summary: "微信登录跳转" })
  @Post('wechatLogin')
  async wechatLogin(@Headers() header, @Res() res) {
    const APPID = process.env.APPID
    const redirectUri = encodeURIComponent('http://wwww.baidu.com')
    res.redirect(`https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`)
  }

  // TODO: 待完成
  @ApiOperation({ summary: "微信登录" })
  @ApiBody({  })
  @Post('wechat')
  async loginWithWechat(@Body('code') code: string) {
    return this.authService.loginWithWechat(code);
  }
}
