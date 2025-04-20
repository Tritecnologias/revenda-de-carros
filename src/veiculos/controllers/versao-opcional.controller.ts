import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { VersaoOpcionalService } from '../services/versao-opcional.service';
import { CreateVersaoOpcionalDto, UpdateVersaoOpcionalDto } from '../dto/versao-opcional.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('api/veiculos/versao-opcional')
export class VersaoOpcionalController {
  constructor(private readonly versaoOpcionalService: VersaoOpcionalService) {}

  @Get('public')
  async findAllPublic(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('versaoId') versaoId?: number,
  ) {
    console.log(`VersaoOpcionalController: Acessando rota pública para buscar associações. VersaoId: ${versaoId || 'não especificado'}`);
    const result = await this.versaoOpcionalService.findAll(page, limit, versaoId);
    console.log(`VersaoOpcionalController: Retornando ${result.items.length} associações (público)`);
    return result;
  }

  @Get('public/versao/:id')
  async findByVersaoPublic(@Param('id') id: number) {
    console.log(`VersaoOpcionalController: Acessando rota pública para buscar opcionais da versão ID: ${id}`);
    const result = await this.versaoOpcionalService.findByVersaoPublic(id);
    console.log(`VersaoOpcionalController: Retornando ${result.length} opcionais para a versão ID: ${id} (público)`);
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('versaoId') versaoId?: number,
  ) {
    return this.versaoOpcionalService.findAll(page, limit, versaoId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async findOne(@Param('id') id: number) {
    return this.versaoOpcionalService.findOne(id);
  }

  @Get('versao/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async findByVersao(@Param('id') id: number) {
    return this.versaoOpcionalService.findByVersao(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async create(@Body() createVersaoOpcionalDto: CreateVersaoOpcionalDto) {
    return this.versaoOpcionalService.create(createVersaoOpcionalDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async update(@Param('id') id: number, @Body() updateVersaoOpcionalDto: UpdateVersaoOpcionalDto) {
    return this.versaoOpcionalService.update(id, updateVersaoOpcionalDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cadastrador')
  async remove(@Param('id') id: number) {
    return this.versaoOpcionalService.remove(id);
  }
}
