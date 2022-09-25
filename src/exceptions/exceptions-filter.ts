import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { Exception } from './Exception';

/**
 * Our own custom exceptions filter.
 * This is needed so that we don't polute our services with HttpExceptions
 * This filter will convert the businessLogicExceptions into Nest js Http exceptions
 */
@Catch(Exception)
export class BusinessLogicExceptionFilter implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const httpExceptionConstructor = getHttpExceptionConstructor(exception);
    const httpException = new httpExceptionConstructor(exception.errorOrObject);

    response
      .status(httpException.getStatus())
      .json(httpException.getResponse());
  }
}

declare class HttpException {
  getStatus: () => number;
  getResponse: () => any;
  constructor(objectOrError?: string | object | any, description?: string);
}

const businessExceptionToHttpExceptionMap: Record<
  string,
  typeof HttpException
> = {
  PermissionDeniedException: ForbiddenException,
  NotFoundException: NotFoundException,
  InvalidArgumentException: UnprocessableEntityException,
  Exception: InternalServerErrorException,
};

const getHttpExceptionConstructor = (
  exception: Exception,
): typeof HttpException => {
  const exceptionName = exception.constructor.name;
  const httpExceptionConstructor =
    businessExceptionToHttpExceptionMap[exceptionName];

  return httpExceptionConstructor;
};
