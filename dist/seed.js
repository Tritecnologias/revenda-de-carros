"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("@nestjs/typeorm");
const veiculo_entity_1 = require("./configurador/entities/veiculo.entity");
const pintura_entity_1 = require("./configurador/entities/pintura.entity");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const veiculoRepo = app.get((0, typeorm_1.getRepositoryToken)(veiculo_entity_1.Veiculo));
    const pinturaRepo = app.get((0, typeorm_1.getRepositoryToken)(pintura_entity_1.Pintura));
    const veiculo = await veiculoRepo.save({
        marca: 'VOLKSWAGEN',
        modelo: 'VIRTUS',
        versao: 'VIRTUS SENSE TSI 116CV (BZ4AK4-0)',
        precoPublico: 105990.00,
        precoZonaFranca: 93695.15,
        precoPcdIpi: 102176.21,
        precoTaxiIpiIcms: 89915.07,
        precoTaxiIpi: 102176.21,
    });
    const pinturas = await pinturaRepo.save([
        {
            tipo: 'SÓLIDA',
            nome: 'Preto Ninja',
            preco: 0.00,
            veiculo,
        },
        {
            tipo: 'SÓLIDA',
            nome: 'Branco Cristal',
            preco: 900.00,
            veiculo,
        },
        {
            tipo: 'METÁLICA',
            nome: 'Cinza Platinum',
            preco: 1650.00,
            veiculo,
        },
        {
            tipo: 'METÁLICA',
            nome: 'Azul Biscay',
            preco: 1650.00,
            veiculo,
        },
        {
            tipo: 'METÁLICA',
            nome: 'Prata Sirius',
            preco: 1650.00,
            veiculo,
        },
    ]);
    console.log('Seed data inserted successfully!');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map