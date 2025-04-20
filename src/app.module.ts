import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfiguradorModule } from './configurador/configurador.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VeiculosModule } from './veiculos/veiculos.module';
import { Veiculo as ConfiguradorVeiculo } from './configurador/entities/veiculo.entity';
import { Pintura } from './configurador/entities/pintura.entity';
import { ModeloPintura } from './configurador/entities/modelo-pintura.entity';
import { User } from './users/entities/user.entity';
import { Marca } from './veiculos/entities/marca.entity';
import { Modelo } from './veiculos/entities/modelo.entity';
import { Veiculo } from './veiculos/entities/veiculo.entity';
import { Opcional } from './veiculos/entities/opcional.entity';
import { ModeloOpcional } from './veiculos/entities/modelo-opcional.entity';
import { VendaDireta } from './veiculos/entities/venda-direta.entity';
import { Versao } from './veiculos/entities/versao.entity';
import { VersaoOpcional } from './veiculos/entities/versao-opcional.entity';
import { VersaoPintura } from './veiculos/entities/versao-pintura.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '69.62.91.195',
      port: 3306,
      username: 'wanderson',
      password: 'Flavinha@2022',
      database: 'revenda_carros',
      entities: [ConfiguradorVeiculo, Pintura, ModeloPintura, User, Marca, Modelo, Veiculo, Opcional, ModeloOpcional, VendaDireta, Versao, VersaoOpcional, VersaoPintura],
      synchronize: true, // Disable in production
    }),
    ConfiguradorModule,
    AuthModule,
    UsersModule,
    VeiculosModule,
  ],
})
export class AppModule {}
