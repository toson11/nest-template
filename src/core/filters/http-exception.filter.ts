import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const msg = exception.message || `${status >= 500 ? '系统异常' : '请求异常'}`;
    const errorResponse = {
      data: {},
      msg,
      code: -1,
    }
    // if(exception.response) {
    //   errorResponse.erros = exception.response
    // }

    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse)
  }
}
