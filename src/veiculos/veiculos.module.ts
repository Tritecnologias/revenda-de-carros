import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';
import { Modelo } from './entities/modelo.entity';
import { Veiculo } from './entities/veiculo.entity';
import { Opcional } from './entities/opcional.entity';
import { ModeloOpcional } from './entities/modelo-opcional.entity';
import { VendaDireta } from './entities/venda-direta.entity';
import { Versao } from './entities/versao.entity';
import { VersaoOpcional } from './entities/versao-opcional.entity';
import { VersaoPintura } from './entities/versao-pintura.entity';
import { MarcasController } from './controllers/marcas.controller';
import { ModelosController } from './controllers/modelos.controller';
import { VeiculosController } from './controllers/veiculos.controller';
import { OpcionaisController } from './controllers/opcionais.controller';
import { ModeloOpcionalController } from './controllers/modelo-opcional.controller';
import { VendaDiretaController } from './controllers/venda-direta.controller';
import { VersoesController } from './controllers/versoes.controller';
import { VersaoOpcionalController } from './controllers/versao-opcional.controller';
import { VersaoPinturaController } from './controllers/versao-pintura.controller';
import { MarcasService } from './services/marcas.service';
import { ModelosService } from './services/modelos.service';
import { VeiculosService } from './services/veiculos.service';
import { OpcionaisService } from './services/opcionais.service';
import { ModeloOpcionalService } from './services/modelo-opcional.service';
import { VendaDiretaService } from './services/venda-direta.service';
import { VersoesService } from './services/versoes.service';
import { VersaoOpcionalService } from './services/versao-opcional.service';
import { VersaoPinturaService } from './services/versao-pintura.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Marca, Modelo, Veiculo, Opcional, ModeloOpcional, VendaDireta, Versao, VersaoOpcional, VersaoPintura]),
  ],
  controllers: [
    MarcasController,
    ModelosController,
    VeiculosController,
    OpcionaisController,
    ModeloOpcionalController,
    VendaDiretaController,
    VersoesController,
    VersaoOpcionalController,
    VersaoPinturaController,
  ],
  providers: [
    MarcasService,
    ModelosService,
    VeiculosService,
    OpcionaisService,
    ModeloOpcionalService,
    VendaDiretaService,
    VersoesService,
    VersaoOpcionalService,
    VersaoPinturaService,
  ],
  exports: [
    MarcasService,
    ModelosService,
    VeiculosService,
    OpcionaisService,
    ModeloOpcionalService,
    VendaDiretaService,
    VersoesService,
    VersaoOpcionalService,
    VersaoPinturaService,
  ],
})
export class VeiculosModule {}
