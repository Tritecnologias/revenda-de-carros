import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { VendaDiretaService } from '../services/venda-direta.service';
import { CreateVendaDiretaDto, UpdateVendaDiretaDto } from '../dto/venda-direta.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/venda-direta')
export class VendaDiretaController {
  constructor(private readonly vendaDiretaService: VendaDiretaService) {}

  @Get('public')
  async findAllPublic(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('marcaId') marcaId?: number,
  ) {
    console.log(`VendaDiretaController: Acessando rota pública para buscar vendas diretas. MarcaId: ${marcaId || 'não especificado'}`);
    const result = await this.vendaDiretaService.findAll(page, limit, marcaId);
    console.log(`VendaDiretaController: Retornando ${result.items.length} vendas diretas (público)`);
    return result;
  }

  @Get('public/:id')
  async findOnePublic(@Param('id') id: number) {
    console.log(`VendaDiretaController: Acessando rota pública para buscar venda direta ID: ${id}`);
    const result = await this.vendaDiretaService.findOne(id);
    console.log(`VendaDiretaController: Retornando venda direta ID: ${id} (público)`);
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('marcaId') marcaId?: number,
  ) {
    return this.vendaDiretaService.findAll(page, limit, marcaId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.vendaDiretaService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createVendaDiretaDto: CreateVendaDiretaDto) {
    return this.vendaDiretaService.create(createVendaDiretaDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() updateVendaDiretaDto: UpdateVendaDiretaDto) {
    return this.vendaDiretaService.update(id, updateVendaDiretaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return this.vendaDiretaService.remove(id);
  }
}
