import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, SetMetadata } from '@nestjs/common';
import { VersoesService, CreateVersaoDto, UpdateVersaoDto } from '../services/versoes.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('api/versoes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VersoesController {
  constructor(private readonly versoesService: VersoesService) {}

  @Post()
  @Roles('admin', 'cadastrador')
  create(@Body() createVersaoDto: CreateVersaoDto) {
    console.log('VersoesController: Criando nova versão', createVersaoDto);
    return this.versoesService.create(createVersaoDto);
  }

  @Get()
  findAll() {
    console.log('VersoesController: Buscando todas as versões');
    return this.versoesService.findAll();
  }

  @Get('public')
  @SetMetadata('isPublic', true)
  findAllPublic() {
    console.log('VersoesController: Buscando todas as versões (público)');
    return this.versoesService.findAll();
  }

  @Get('modelo/:modeloId')
  findByModelo(@Param('modeloId') modeloId: string) {
    console.log(`VersoesController: Buscando versões para o modelo ${modeloId}`);
    return this.versoesService.findByModelo(+modeloId);
  }

  @Get('modelo/:modeloId/public')
  @SetMetadata('isPublic', true)
  findByModeloPublic(@Param('modeloId') modeloId: string) {
    console.log(`VersoesController: Buscando versões para o modelo ${modeloId} (público)`);
    return this.versoesService.findByModelo(+modeloId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(`VersoesController: Buscando versão ${id}`);
    return this.versoesService.findOne(+id);
  }

  @Get(':id/public')
  @SetMetadata('isPublic', true)
  findOnePublic(@Param('id') id: string) {
    console.log(`VersoesController: Buscando versão ${id} (público)`);
    return this.versoesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'cadastrador')
  update(@Param('id') id: string, @Body() updateVersaoDto: UpdateVersaoDto) {
    console.log(`VersoesController: Atualizando versão ${id}`, updateVersaoDto);
    return this.versoesService.update(+id, updateVersaoDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    console.log(`VersoesController: Removendo versão ${id}`);
    return this.versoesService.remove(+id);
  }
}
