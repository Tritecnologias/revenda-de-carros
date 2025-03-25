import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';
import { Modelo } from './entities/modelo.entity';
import { Veiculo } from './entities/veiculo.entity';
import { Opcional } from './entities/opcional.entity';
import { ModeloOpcional } from './entities/modelo-opcional.entity';
import { VendaDireta } from './entities/venda-direta.entity';
import { MarcasController } from './controllers/marcas.controller';
import { ModelosController } from './controllers/modelos.controller';
import { VeiculosController } from './controllers/veiculos.controller';
import { OpcionaisController } from './controllers/opcionais.controller';
import { ModeloOpcionalController } from './controllers/modelo-opcional.controller';
import { VendaDiretaController } from './controllers/venda-direta.controller';
import { MarcasService } from './services/marcas.service';
import { ModelosService } from './services/modelos.service';
import { VeiculosService } from './services/veiculos.service';
import { OpcionaisService } from './services/opcionais.service';
import { ModeloOpcionalService } from './services/modelo-opcional.service';
import { VendaDiretaService } from './services/venda-direta.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Marca, Modelo, Veiculo, Opcional, ModeloOpcional, VendaDireta]),
  ],
  controllers: [
    MarcasController,
    ModelosController,
    VeiculosController,
    OpcionaisController,
    ModeloOpcionalController,
    VendaDiretaController,
  ],
  providers: [
    MarcasService,
    ModelosService,
    VeiculosService,
    OpcionaisService,
    ModeloOpcionalService,
    VendaDiretaService,
  ],
  exports: [
    MarcasService,
    ModelosService,
    VeiculosService,
    OpcionaisService,
    ModeloOpcionalService,
    VendaDiretaService,
  ],
})
export class VeiculosModule {}
