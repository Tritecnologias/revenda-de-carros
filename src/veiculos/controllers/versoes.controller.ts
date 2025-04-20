import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, SetMetadata, HttpException, HttpStatus } from '@nestjs/common';
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
  async create(@Body() createVersaoDto: CreateVersaoDto) {
    try {
      console.log('VersoesController: Criando nova versão', createVersaoDto);
      return await this.versoesService.create(createVersaoDto);
    } catch (error) {
      console.error('VersoesController: Erro ao criar versão:', error.message);
      throw new HttpException(
        error.message || 'Erro ao criar versão',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll() {
    try {
      console.log('VersoesController: Buscando todas as versões');
      return await this.versoesService.findAll();
    } catch (error) {
      console.error('VersoesController: Erro ao buscar versões:', error.message);
      throw new HttpException(
        error.message || 'Erro ao buscar versões',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('public')
  @SetMetadata('isPublic', true)
  async findAllPublic() {
    try {
      console.log('VersoesController: Buscando todas as versões (público)');
      return await this.versoesService.findAll();
    } catch (error) {
      console.error('VersoesController: Erro ao buscar versões (público):', error.message);
      throw new HttpException(
        error.message || 'Erro ao buscar versões',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('all')
  @SetMetadata('isPublic', true)
  async findAllAlternative() {
    try {
      console.log('VersoesController: Buscando todas as versões (endpoint alternativo)');
      return await this.versoesService.findAll();
    } catch (error) {
      console.error('VersoesController: Erro ao buscar versões (endpoint alternativo):', error.message);
      throw new HttpException(
        error.message || 'Erro ao buscar versões',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('modelo/:modeloId')
  async findByModelo(@Param('modeloId') modeloId: string) {
    try {
      console.log(`VersoesController: Buscando versões para o modelo ${modeloId}`);
      return await this.versoesService.findByModelo(+modeloId);
    } catch (error) {
      console.error(`VersoesController: Erro ao buscar versões para o modelo ${modeloId}:`, error.message);
      throw new HttpException(
        error.message || `Erro ao buscar versões para o modelo ${modeloId}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('modelo/:modeloId/public')
  @SetMetadata('isPublic', true)
  async findByModeloPublic(@Param('modeloId') modeloId: string) {
    try {
      console.log(`VersoesController: Buscando versões para o modelo ${modeloId} (público)`);
      return await this.versoesService.findByModelo(+modeloId);
    } catch (error) {
      console.error(`VersoesController: Erro ao buscar versões para o modelo ${modeloId} (público):`, error.message);
      throw new HttpException(
        error.message || `Erro ao buscar versões para o modelo ${modeloId}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      console.log(`VersoesController: Buscando versão ${id}`);
      return await this.versoesService.findOne(+id);
    } catch (error) {
      console.error(`VersoesController: Erro ao buscar versão ${id}:`, error.message);
      throw new HttpException(
        error.message || `Erro ao buscar versão com ID ${id}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id/public')
  @SetMetadata('isPublic', true)
  async findOnePublic(@Param('id') id: string) {
    try {
      console.log(`VersoesController: Buscando versão ${id} (público)`);
      return await this.versoesService.findOne(+id);
    } catch (error) {
      console.error(`VersoesController: Erro ao buscar versão ${id} (público):`, error.message);
      throw new HttpException(
        error.message || `Erro ao buscar versão com ID ${id}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  @Roles('admin', 'cadastrador')
  async update(@Param('id') id: string, @Body() updateVersaoDto: UpdateVersaoDto) {
    try {
      console.log(`VersoesController: Atualizando versão ${id}`, updateVersaoDto);
      return await this.versoesService.update(+id, updateVersaoDto);
    } catch (error) {
      console.error(`VersoesController: Erro ao atualizar versão ${id}:`, error.message);
      throw new HttpException(
        error.message || `Erro ao atualizar versão com ID ${id}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    try {
      console.log(`VersoesController: Removendo versão ${id}`);
      return await this.versoesService.remove(+id);
    } catch (error) {
      console.error(`VersoesController: Erro ao remover versão ${id}:`, error.message);
      throw new HttpException(
        error.message || `Erro ao remover versão com ID ${id}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
