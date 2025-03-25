import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Veiculo } from './configurador/entities/veiculo.entity';
import { Pintura } from './configurador/entities/pintura.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const veiculoRepo = app.get(getRepositoryToken(Veiculo));
  const pinturaRepo = app.get(getRepositoryToken(Pintura));

  // Create vehicle
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

  // Create paint options
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
