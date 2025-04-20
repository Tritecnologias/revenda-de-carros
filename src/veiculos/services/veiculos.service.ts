import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from '../entities/veiculo.entity';
import { CreateVeiculoDto, UpdateVeiculoDto } from '../dto/veiculo.dto';
import { MarcasService } from './marcas.service';
import { ModelosService } from './modelos.service';
import { VersoesService } from './versoes.service';

@Injectable()
export class VeiculosService {
  private readonly logger = new Logger(VeiculosService.name);

  constructor(
    @InjectRepository(Veiculo)
    private veiculosRepository: Repository<Veiculo>,
    private marcasService: MarcasService,
    private modelosService: ModelosService,
    private versoesService: VersoesService,
  ) {}

  async findAll(page = 1, limit = 10, modeloId?: number) {
    try {
      this.logger.log(`Buscando veículos - página: ${page}, limite: ${limit}, modeloId: ${modeloId || 'não especificado'}`);
      
      const queryBuilder = this.veiculosRepository.createQueryBuilder('veiculo')
        .leftJoinAndSelect('veiculo.marca', 'marca')
        .leftJoinAndSelect('veiculo.modelo', 'modelo')
        .leftJoinAndSelect('veiculo.versao', 'versao')
        .orderBy('veiculo.createdAt', 'DESC');

      // Filtrar por modelo se fornecido
      if (modeloId) {
        queryBuilder.where('veiculo.modeloId = :modeloId', { modeloId });
      }

      const [items, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      
      this.logger.log(`Encontrados ${items.length} veículos de um total de ${total}`);

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar veículos: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erro ao buscar veículos: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      this.logger.log(`Buscando veículo com ID: ${id}`);
      
      const veiculo = await this.veiculosRepository.findOne({
        where: { id },
        relations: ['marca', 'modelo', 'versao'],
      });
      
      if (!veiculo) {
        this.logger.warn(`Veículo com ID ${id} não encontrado`);
        throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
      }
      
      this.logger.log(`Veículo com ID ${id} encontrado`);
      return veiculo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar veículo com ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erro ao buscar veículo: ${error.message}`);
    }
  }

  async create(createVeiculoDto: CreateVeiculoDto) {
    try {
      this.logger.log(`Criando novo veículo: ${JSON.stringify(createVeiculoDto)}`);
      
      // Verificar se a marca existe
      await this.marcasService.findOne(createVeiculoDto.marcaId);

      // Verificar se o modelo existe
      await this.modelosService.findOne(createVeiculoDto.modeloId);
      
      // Verificar se a versão existe
      await this.versoesService.findOne(createVeiculoDto.versaoId);

      const veiculo = this.veiculosRepository.create(createVeiculoDto);
      const result = await this.veiculosRepository.save(veiculo);
      
      this.logger.log(`Veículo criado com sucesso, ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao criar veículo: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateVeiculoDto: UpdateVeiculoDto) {
    try {
      this.logger.log(`Atualizando veículo com ID ${id}: ${JSON.stringify(updateVeiculoDto)}`);
      
      // Verificar se o veículo existe
      const veiculo = await this.findOne(id);

      // Verificar se a marca existe, se foi fornecida
      if (updateVeiculoDto.marcaId) {
        await this.marcasService.findOne(updateVeiculoDto.marcaId);
      }

      // Verificar se o modelo existe, se foi fornecido
      if (updateVeiculoDto.modeloId) {
        await this.modelosService.findOne(updateVeiculoDto.modeloId);
      }
      
      // Verificar se a versão existe, se foi fornecida
      if (updateVeiculoDto.versaoId) {
        await this.versoesService.findOne(updateVeiculoDto.versaoId);
      }

      // Atualizar o veículo
      await this.veiculosRepository.update(id, updateVeiculoDto);
      
      this.logger.log(`Veículo com ID ${id} atualizado com sucesso`);
      return this.findOne(id);
    } catch (error) {
      this.logger.error(`Erro ao atualizar veículo com ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      this.logger.log(`Removendo veículo com ID ${id}`);
      
      const veiculo = await this.findOne(id);
      const result = await this.veiculosRepository.remove(veiculo);
      
      this.logger.log(`Veículo com ID ${id} removido com sucesso`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao remover veículo com ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
