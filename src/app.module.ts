import { Module } from '@nestjs/common';
import envConfig from '../config/env'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UsersEntity } from './users/entities/users.entity';
import { RedisCacheModule } from './db/redis-cache.module';
import { AuthModule } from './auth/auth.module';
const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envConfig.path]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        entities: [UsersEntity], // 数据表实体
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'),   // 用户名
        password: configService.get('DB_PASSWORD'), // 密码
        database: configService.get('DB_DATABASE'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: !isProd, //根据实体自动创建/修改数据库表，生产环境建议关闭，避免自动同步误操作数据表
      })
    }),
    RedisCacheModule,
    AuthModule,
    UsersModule,
  ]
})
export class AppModule {}
