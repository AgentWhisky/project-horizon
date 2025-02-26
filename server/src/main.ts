import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  /*app.enableCors({
    origin: ['http://localhost:4200'],
  });*/

  app.enableCors(); // FIX FOR PRODUCTION

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  console.log(`Server Running on: ${await app.getUrl()}`);
}
bootstrap();
