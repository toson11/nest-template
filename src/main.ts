import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局路由前缀
  app.setGlobalPrefix('api/v1')
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // 自动转换有效负载为 DTO 实例
    whitelist: true, // 只允许 DTO 中定义了 class-validator装饰器 的属性
    forbidNonWhitelisted: true, // 禁止未定义的属性
    exceptionFactory: errors => {
      // 返回校验时定义的错误消息
      const messages = errors.map(error => error.constraints).flat();
      console.log("🚀 ~ bootstrap ~ messages:", messages)
      return new HttpException({ messages }, HttpStatus.BAD_REQUEST)
    }
  }))

  if(!isProd) {
    // 设置swagger接口文档
    const config = new DocumentBuilder()
      .setTitle('nest后端')
      .setDescription('nest后端接口文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config)
    // 文档路由/docs
    SwaggerModule.setup('docs', app, document)
  }

  await app.listen(3000);
}
bootstrap();
