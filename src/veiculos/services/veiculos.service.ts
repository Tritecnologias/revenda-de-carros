import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from '../entities/veiculo.entity';
import { CreateVeiculoDto, UpdateVeiculoDto } from '../dto/veiculo.dto';
import { MarcasService } from './marcas.service';
import { ModelosService } from './modelos.service';
import { VersoesService } from './versoes.service';

@Injectable()
export class VeiculosService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculosRepository: Repository<Veiculo>,
    private marcasService: MarcasService,
    private modelosService: ModelosService,
    private versoesService: VersoesService,
  ) {}

  async findAll(page = 1, limit = 10, modeloId?: number) {
    try {
      console.log(`VeiculosService: Buscando veículos - página ${page}, limite ${limit}, modeloId: ${modeloId || 'não especificado'}`);
      
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

      console.log(`VeiculosService: Encontrados ${items.length} veículos de um total de ${total}`);

      // Retornar no formato esperado pelo frontend (com meta)
      return {
        items,
        meta: {
          totalItems: total,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(total / limit),
          currentPage: page
        }
      };
    } catch (error) {
      console.error('VeiculosService: Erro ao buscar veículos:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const veiculo = await this.veiculosRepository.findOne({
      where: { id },
      relations: ['marca', 'modelo', 'versao'],
    });
    
    if (!veiculo) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }
    
    return veiculo;
  }

  async create(createVeiculoDto: CreateVeiculoDto) {
    // Verificar se a marca existe
    await this.marcasService.findOne(createVeiculoDto.marcaId);

    // Verificar se o modelo existe
    await this.modelosService.findOne(createVeiculoDto.modeloId);
    
    // Verificar se a versão existe
    await this.versoesService.findOne(createVeiculoDto.versaoId);

    const veiculo = this.veiculosRepository.create(createVeiculoDto);
    return this.veiculosRepository.save(veiculo);
  }

  async update(id: number, updateVeiculoDto: UpdateVeiculoDto) {
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
    return this.findOne(id);
  }

  async remove(id: number) {
    const veiculo = await this.findOne(id);
    return this.veiculosRepository.remove(veiculo);
  }
}
