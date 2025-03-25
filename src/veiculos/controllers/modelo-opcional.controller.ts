import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ModeloOpcionalService } from '../services/modelo-opcional.service';
import { ModeloOpcionalDto, UpdateModeloOpcionalDto } from '../dto/modelo-opcional.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { InternalServerErrorException } from '@nestjs/common';

@Controller('api/modelo-opcional')
export class ModeloOpcionalController {
  constructor(private readonly modeloOpcionalService: ModeloOpcionalService) {}

  // Removido o guard JwtAuthGuard para permitir acesso público
  @Get()
  async findAll() {
    try {
      console.log('ModeloOpcionalController: Listando todas as associações');
      const result = await this.modeloOpcionalService.findAll();
      console.log(`ModeloOpcionalController: Encontradas ${result.length} associações`);
      return result;
    } catch (error) {
      console.error('ModeloOpcionalController: Erro ao listar associações', error);
      throw new InternalServerErrorException('Erro ao buscar associações');
    }
  }

  // Removido o guard JwtAuthGuard para permitir acesso público
  @Get('by-modelo/:modeloId')
  async findByModeloId(@Param('modeloId') modeloId: string) {
    try {
      console.log(`ModeloOpcionalController: Buscando opcionais para o modelo ID: ${modeloId}`);
      const result = await this.modeloOpcionalService.findByModeloId(+modeloId);
      console.log(`ModeloOpcionalController: Encontrados ${result.length} opcionais para o modelo ID: ${modeloId}`);
      return result;
    } catch (error) {
      console.error(`ModeloOpcionalController: Erro ao buscar opcionais para o modelo ID: ${modeloId}`, error);
      throw new InternalServerErrorException('Erro ao buscar opcionais para o modelo');
    }
  }

  @Get('by-modelo/:modeloId/public')
  async findByModeloPublic(@Param('modeloId') modeloId: number) {
    try {
      console.log(`Buscando opcionais para o modelo ID: ${modeloId}`);
      const modeloOpcionais = await this.modeloOpcionalService.findByModeloId(modeloId);
      
      // Transformar os dados para o formato necessário para o frontend
      const opcionaisFormatados = modeloOpcionais.map(mo => ({
        id: mo.id,
        codigo: mo.opcional.codigo,
        descricao: mo.opcional.descricao,
        preco: mo.preco,
        opcionalId: mo.opcionalId,
        modeloId: mo.modeloId
      }));
      
      console.log(`Encontrados ${opcionaisFormatados.length} opcionais para o modelo ID: ${modeloId}`);
      return opcionaisFormatados;
    } catch (error) {
      console.error(`Erro ao buscar opcionais para o modelo ID: ${modeloId}`, error);
      throw new InternalServerErrorException('Erro ao buscar opcionais para o modelo');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.modeloOpcionalService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() modeloOpcionalDto: ModeloOpcionalDto) {
    return this.modeloOpcionalService.create(modeloOpcionalDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async update(@Param('id') id: string, @Body() updateModeloOpcionalDto: UpdateModeloOpcionalDto) {
    return this.modeloOpcionalService.update(+id, updateModeloOpcionalDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.modeloOpcionalService.remove(+id);
    return { success: true };
  }
}
