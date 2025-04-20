import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configurar CORS
  app.enableCors();
  
  // Configurar arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'src', 'public'), {
    prefix: '/',
    index: 'index.html',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Aplicação rodando em http://localhost:${port}`);
}
bootstrap();
