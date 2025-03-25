import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { VeiculosService } from '../services/veiculos.service';
import { CreateVeiculoDto, UpdateVeiculoDto } from '../dto/veiculo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('modeloId') modeloId?: number,
  ) {
    return this.veiculosService.findAll(page, limit, modeloId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.veiculosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createVeiculoDto: CreateVeiculoDto) {
    return this.veiculosService.create(createVeiculoDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateVeiculoDto: UpdateVeiculoDto,
  ) {
    return this.veiculosService.update(id, updateVeiculoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return this.veiculosService.remove(id);
  }
}
