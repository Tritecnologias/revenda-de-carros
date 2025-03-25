import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguradorController } from './configurador.controller';
import { ConfiguradorService } from './configurador.service';
import { Veiculo } from './entities/veiculo.entity';
import { Pintura } from './entities/pintura.entity';
import { ModeloPintura } from './entities/modelo-pintura.entity';
import { Modelo } from '../veiculos/entities/modelo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Veiculo, Pintura, ModeloPintura, Modelo])],
  controllers: [ConfiguradorController],
  providers: [ConfiguradorService],
})
export class ConfiguradorModule {}
