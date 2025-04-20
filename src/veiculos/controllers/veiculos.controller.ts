import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { VeiculosService } from '../services/veiculos.service';
import { CreateVeiculoDto, UpdateVeiculoDto } from '../dto/veiculo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('api/veiculos')
export class VeiculosController {
  constructor(private readonly veiculosService: VeiculosService) {}

  @Get('public')
  async findAllPublic(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('modeloId') modeloId?: number,
  ) {
    console.log(`VeiculosController: Acessando rota pública para buscar veículos. ModeloId: ${modeloId || 'não especificado'}`);
    const result = await this.veiculosService.findAll(page, limit, modeloId);
    console.log(`VeiculosController: Retornando ${result.items.length} veículos (público)`);
    return result;
  }

  @Get('public/:id')
  async findOnePublic(@Param('id') id: number) {
    console.log(`VeiculosController: Acessando rota pública para buscar veículo ID: ${id}`);
    const result = await this.veiculosService.findOne(id);
    console.log(`VeiculosController: Retornando veículo ID: ${id} (público)`);
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('modeloId') modeloId?: number,
  ) {
    return this.veiculosService.findAll(page, limit, modeloId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async findOne(@Param('id') id: number) {
    return this.veiculosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async create(@Body() createVeiculoDto: CreateVeiculoDto) {
    console.log('VeiculosController: Criando veículo com dados:', JSON.stringify(createVeiculoDto));
    try {
      const result = await this.veiculosService.create(createVeiculoDto);
      console.log('VeiculosController: Veículo criado com sucesso, ID:', result.id);
      return result;
    } catch (error) {
      console.error('VeiculosController: Erro ao criar veículo:', error.message);
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async update(
    @Param('id') id: number,
    @Body() updateVeiculoDto: UpdateVeiculoDto,
  ) {
    console.log(`VeiculosController: Atualizando veículo ID ${id} com dados:`, JSON.stringify(updateVeiculoDto));
    try {
      const result = await this.veiculosService.update(id, updateVeiculoDto);
      console.log(`VeiculosController: Veículo ID ${id} atualizado com sucesso`);
      return result;
    } catch (error) {
      console.error(`VeiculosController: Erro ao atualizar veículo ID ${id}:`, error.message);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async remove(@Param('id') id: number) {
    return this.veiculosService.remove(id);
  }
}
