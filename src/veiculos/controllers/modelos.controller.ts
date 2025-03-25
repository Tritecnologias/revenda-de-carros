import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, SetMetadata, InternalServerErrorException } from '@nestjs/common';
import { ModelosService } from '../services/modelos.service';
import { CreateModeloDto, UpdateModeloDto } from '../dto/modelo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/veiculos/modelos')
export class ModelosController {
  constructor(private readonly modelosService: ModelosService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.modelosService.findAll(page, limit);
  }

  @Get('all')
  // Removido o guard JwtAuthGuard para permitir acesso público
  async findAllActive() {
    try {
      console.log('ModelosController: Buscando todos os modelos ativos');
      const modelos = await this.modelosService.findAllActive();
      console.log(`ModelosController: Encontrados ${modelos.length} modelos ativos`);
      return modelos;
    } catch (error) {
      console.error('ModelosController: Erro ao buscar modelos ativos', error);
      throw new InternalServerErrorException('Erro ao buscar modelos');
    }
  }

  @Get('public/all')
  @SetMetadata('isPublic', true)
  async findAllActivePublic() {
    console.log('ModelosController: Acessando rota pública para buscar todos os modelos ativos');
    const modelos = await this.modelosService.findAllActive();
    console.log(`ModelosController: Retornando ${modelos.length} modelos ativos (público)`);
    return modelos;
  }

  @Get('by-marca/:marcaId')
  @UseGuards(JwtAuthGuard)
  async findByMarca(@Param('marcaId') marcaId: number) {
    console.log(`Controller: Buscando modelos para marca ID: ${marcaId}`);
    return this.modelosService.findByMarca(marcaId);
  }

  @Get('public/by-marca/:marcaId')
  @SetMetadata('isPublic', true)
  async findByMarcaPublic(@Param('marcaId') marcaId: number) {
    console.log(`ModelosController: Acessando rota pública para buscar modelos da marca ID: ${marcaId}`);
    const result = await this.modelosService.findByMarca(marcaId);
    console.log(`ModelosController: Retornando ${result.length} modelos (público)`);
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.modelosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createModeloDto: CreateModeloDto) {
    return this.modelosService.create(createModeloDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateModeloDto: UpdateModeloDto,
  ) {
    return this.modelosService.update(id, updateModeloDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return this.modelosService.remove(id);
  }
}
