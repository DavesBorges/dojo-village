import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupDatabase } from './data/setup_database';

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
  await app.listen(80);
}
bootstrap();
