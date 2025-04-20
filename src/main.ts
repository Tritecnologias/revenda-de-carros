import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  try {
    const logger = new Logger('Bootstrap');
    logger.log('Iniciando aplicação...');
    
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    // Configurar CORS
    app.enableCors({
      origin: true, // Permitir todas as origens
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    
    // Configurar validação global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    
    // Configurar filtro de exceção global
    app.useGlobalFilters(new HttpExceptionFilter());
    
    // Configurar prefixo global para APIs
    app.setGlobalPrefix('api', {
      exclude: ['/'], // Excluir a rota raiz
    });
    
    // Configurar arquivos estáticos
    app.useStaticAssets(join(__dirname, '..', 'src', 'public'), {
      prefix: '/',
      index: 'index.html',
    });

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0'); // Escutar em todas as interfaces
    logger.log(`Aplicação rodando em http://localhost:${port}`);
    logger.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

bootstrap();
