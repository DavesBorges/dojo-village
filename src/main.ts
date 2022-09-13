import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupDatabase } from './data/setup_database';

async function bootstrap() {
  setupDatabase();
  const app = await NestFactory.create(AppModule);
  await app.listen(80);
}
bootstrap();
