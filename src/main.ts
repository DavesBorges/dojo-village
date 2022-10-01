import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupDatabase } from './data/setup_database';
import { BusinessLogicExceptionFilter } from './exceptions/exceptions-filter';

const configureSwaggerModule = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Dojo Village')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_, methodkey) => methodkey,
  });
  SwaggerModule.setup('docs', app, document);
};
async function bootstrap() {
  setupDatabase();
  const app = await NestFactory.create(AppModule);

  // Set the validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  // Use Exception filter to match our custom exceptions with http ones
  app.useGlobalFilters(new BusinessLogicExceptionFilter());

  configureSwaggerModule(app);

  await app.listen(80);
}
bootstrap();
