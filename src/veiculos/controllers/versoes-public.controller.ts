import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { VersoesService } from '../services/versoes.service';

@Controller('api/veiculos/versoes')
export class VersoesPublicController {
  constructor(private readonly versoesService: VersoesService) {}

  @Get()
  async findAll() {
    try {
      console.log('VersoesPublicController: Buscando todas as versões (público)');
      return await this.versoesService.findAll();
    } catch (error) {
      console.error('VersoesPublicController: Erro ao buscar versões (público):', error.message);
      throw new HttpException(
        error.message || 'Erro ao buscar versões',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('all')
  async findAllAlternative() {
    try {
      console.log('VersoesPublicController: Buscando todas as versões (endpoint alternativo)');
      return await this.versoesService.findAll();
    } catch (error) {
      console.error('VersoesPublicController: Erro ao buscar versões (endpoint alternativo):', error.message);
      throw new HttpException(
        error.message || 'Erro ao buscar versões',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('modelo/:modeloId')
  async findByModelo(@Param('modeloId') modeloId: string) {
    try {
      console.log(`VersoesPublicController: Buscando versões para o modelo ${modeloId}`);
      return await this.versoesService.findByModelo(+modeloId);
    } catch (error) {
      console.error(`VersoesPublicController: Erro ao buscar versões para o modelo ${modeloId}:`, error.message);
      throw new HttpException(
        error.message || `Erro ao buscar versões para o modelo ${modeloId}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      console.log(`VersoesPublicController: Buscando versão ${id}`);
      return await this.versoesService.findOne(+id);
    } catch (error) {
      console.error(`VersoesPublicController: Erro ao buscar versão ${id}:`, error.message);
      throw new HttpException(
        error.message || `Erro ao buscar versão ${id}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
