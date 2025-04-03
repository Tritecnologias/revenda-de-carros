import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Versao } from '../entities/versao.entity';
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

  async findByModelo(modeloId: number): Promise<Versao[]> {
    return this.versaoRepository.find({
      where: { modeloId },
      relations: ['modelo', 'modelo.marca'],
    });
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
