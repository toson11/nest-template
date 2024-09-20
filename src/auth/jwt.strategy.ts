import { AuthService } from './services/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UsersEntity } from 'src/users/entities/users.entity';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly authRepository: Repository<UsersEntity>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("JWT_SECRET")
    } as StrategyOptions)
  }

  async validate({ username }: UsersEntity) {
    const existUser = await this.authRepository.findOneBy({ username });
    if (!existUser) {
      // throw new UnauthorizedException('token不正确');
      throw new HttpException('token认证失败', HttpStatus.UNAUTHORIZED)
    }
    return existUser;
  }
}