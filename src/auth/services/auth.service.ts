import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from '../dtos/login.dto'; // 添加导入语句
import { RegisterDto } from '../dtos/register.dto';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/users/entities/users.entity';
import { lastValueFrom } from 'rxjs';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly authRepository: Repository<UsersEntity>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(user: RegisterDto) {
    const { username } = user;

    const existUser = await this.authRepository.findOneBy({ username });
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.authRepository.create(user);
    return this.authRepository.save(newUser);
  }

  async login(params: LoginDto) {
    const { username, password } = params;

    // const existUser = await this.authRepository.findOne({ where: { username }, select: ['username', 'password'] })
    const existUser = await this.authRepository
      .createQueryBuilder('auth')
      .addSelect('auth.password')
      .where('auth.username = :username', { username })
      .getOne();
    if (!existUser || !compareSync(password, existUser.password)) {
      throw new HttpException('账号或密码不正确', HttpStatus.NOT_FOUND);
    }

    const token = this.createToken({ ...existUser });
    return { token };
  }

  async loginWithWechat(code: string) {
    if (!code) {
      throw new BadRequestException('微信授权码缺失');
    }
    await this.getAccessToken(code);

    const user = await this.getUserByOpenid();
    if (!user) {
      // 获取微信用户信息，注册新用户
      // const userInfo: WechatUserInfo = await this.getUserInfo();
      // return this.registerByWechat(userInfo);
    }
    return this.login(user);
  }

  // 使用微信用户注册
  async registerByWechat() {}

  // 生成token
  createToken(user: Partial<UsersEntity>) {
    return this.jwtService.sign(user);
  }

  async getUserByOpenid(): Promise<any> {
    // return this.usersService.findByOpenid(this.accessTokenInfo.openid);
  }

  async getAccessToken(code: string) {
    const { APPID, APPSECRET } = process.env;
    if (!APPSECRET) {
      throw new BadRequestException('[getAccessToken]必须有appSecret');
    }
    // if (
    //   !this.accessTokenInfo ||
    //   (this.accessTokenInfo && this.isExpires(this.accessTokenInfo))
    // ) {
    //   // 判断access_token，如果不存在或已过期，请求微信接口获取认证信息
    //   const res: AxiosResponse<WechatError & AccessConfig, any> =
    //     await lastValueFrom(
    //       this.httpService.get(
    //         `${this.apiServer}/sns/oauth2/access_token?appid=${APPID}&secret=${APPSECRET}&code=${code}&grant_type=authorization_code`,
    //       ),
    //     );

    //   if (res.data.errcode) {
    //     throw new BadRequestException(
    //       `[getAccessToken] errcode:${res.data.errcode}, errmsg:${res.data.errmsg}`,
    //     );
    //   }
    //   // 保存认证信息
    //   this.accessTokenInfo = {
    //     accessToken: res.data.access_token,
    //     expiresIn: res.data.expires_in,
    //     getTime: Date.now(),
    //     openid: res.data.openid,
    //   };
    // }
    // // 接口返回token
    // return this.accessTokenInfo.accessToken;
  }
}
