import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';

const APP_PORT = parseInt(process.env.APP_PORT!, 10) || 9080;
const APIDOC_PATH = 'apidoc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Climatix')
    .setDescription(`The Climate `)
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(APIDOC_PATH, app, document);

  app.enableCors();
  await app.init();
  await app.listen(APP_PORT);
  console.log('Listening port:' + APP_PORT);
}
bootstrap();
