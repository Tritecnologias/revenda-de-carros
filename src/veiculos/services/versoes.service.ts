import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Versao } from '../entities/versao.entity';
import { Veiculo } from '../entities/veiculo.entity';
import { ModelosService } from './modelos.service';

// DTOs para Versão
export class CreateVersaoDto {
  nome_versao: string;
  modeloId: number;
  status?: string;
}

export class UpdateVersaoDto {
  nome_versao?: string;
  modeloId?: number;
  status?: string;
}

@Injectable()
export class VersoesService {
  constructor(
    @InjectRepository(Versao)
    private versaoRepository: Repository<Versao>,
    @InjectRepository(Veiculo)
    private veiculosRepository: Repository<Veiculo>,
    private modelosService: ModelosService,
  ) {}

  async findAll(): Promise<Versao[]> {
    return this.versaoRepository.find({
      relations: ['modelo', 'modelo.marca'],
    });
  }

  async findOne(id: number): Promise<Versao> {
    const versao = await this.versaoRepository.findOne({
      where: { id },
      relations: ['modelo', 'modelo.marca'],
    });
    
    if (!versao) {
      throw new NotFoundException(`Versão com ID ${id} não encontrada`);
    }
    
    return versao;
  }

  async findByModelo(modeloId: number): Promise<any[]> {
    // Busca todas as versões do modelo
    const versoes = await this.versaoRepository.find({
      where: { modeloId },
      relations: ['modelo', 'modelo.marca'],
    });

    // Para cada versão, busque o veículo mais recente associado a ela (por ano DESC)
    const result = await Promise.all(versoes.map(async versao => {
      // Log para depuração
      console.log('Buscando veiculo por versaoId:', versao.id, 'modeloId:', versao.modeloId);
      // Busca o veículo mais recente (maior ano) para esta versão e modelo usando o alias correto da tabela
      const veiculo = await this.veiculosRepository
        .createQueryBuilder('veiculo')
        .where('veiculo.versaoId = :versaoId', { versaoId: versao.id })
        .andWhere('veiculo.modeloId = :modeloId', { modeloId: versao.modeloId })
        .orderBy('veiculo.ano', 'DESC')
        .getOne();
      return {
        ...versao,
        veiculoId: veiculo ? veiculo.id : null,
        veiculo: veiculo || null,
      };
    }));
    return result;
  }

  async create(createVersaoDto: CreateVersaoDto): Promise<Versao> {
    // Verificar se o modelo existe
    await this.modelosService.findOne(createVersaoDto.modeloId);
    
    const versao = this.versaoRepository.create(createVersaoDto);
    return this.versaoRepository.save(versao);
  }

  async update(id: number, updateVersaoDto: UpdateVersaoDto): Promise<Versao> {
    const versao = await this.findOne(id);
    
    // Se o modeloId foi fornecido, verificar se o modelo existe
    if (updateVersaoDto.modeloId) {
      await this.modelosService.findOne(updateVersaoDto.modeloId);
    }
    
    this.versaoRepository.merge(versao, updateVersaoDto);
    return this.versaoRepository.save(versao);
  }

  async remove(id: number): Promise<void> {
    const versao = await this.findOne(id);
    await this.versaoRepository.remove(versao);
  }
}
