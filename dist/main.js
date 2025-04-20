"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./filters/http-exception.filter");
async function bootstrap() {
    try {
        const logger = new common_1.Logger('Bootstrap');
        logger.log('Iniciando aplicação...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        });
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }));
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
        app.setGlobalPrefix('api', {
            exclude: ['/'],
        });
        app.useStaticAssets((0, path_1.join)(__dirname, '..', 'src', 'public'), {
            prefix: '/',
            index: 'index.html',
        });
        const port = process.env.PORT || 3000;
        await app.listen(port, '0.0.0.0');
        logger.log(`Aplicação rodando em http://localhost:${port}`);
        logger.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    }
    catch (error) {
        console.error('Erro ao iniciar a aplicação:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map