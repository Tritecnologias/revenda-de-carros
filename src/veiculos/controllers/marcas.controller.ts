import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { MarcasService } from '../services/marcas.service';
import { CreateMarcaDto, UpdateMarcaDto } from '../dto/marca.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('api/veiculos/marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.marcasService.findAll(page, limit);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async findAllActive() {
    console.log('MarcasController: Acessando rota /api/veiculos/marcas/all');
    const result = await this.marcasService.findAllActive();
    console.log(`MarcasController: Retornando ${result.length} marcas`);
    return result;
  }

  @Get('public')
  async findAllPublic() {
    console.log('MarcasController: Acessando rota pública /api/veiculos/marcas/public');
    try {
      const result = await this.marcasService.findAllActive();
      console.log(`MarcasController: Retornando ${result.length} marcas (público)`);
      return result;
    } catch (error) {
      console.error('MarcasController: Erro ao buscar marcas:', error);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async findOne(@Param('id') id: number) {
    return this.marcasService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcasService.create(createMarcaDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async update(
    @Param('id') id: number,
    @Body() updateMarcaDto: UpdateMarcaDto,
  ) {
    return this.marcasService.update(id, updateMarcaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async remove(@Param('id') id: number) {
    return this.marcasService.remove(id);
  }
}
