import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeloOpcional } from '../entities/modelo-opcional.entity';
import { ModeloOpcionalDto, UpdateModeloOpcionalDto } from '../dto/modelo-opcional.dto';
import { ModelosService } from './modelos.service';
import { OpcionaisService } from './opcionais.service';

@Injectable()
export class ModeloOpcionalService {
  constructor(
    @InjectRepository(ModeloOpcional)
    private modeloOpcionalRepository: Repository<ModeloOpcional>,
    private modelosService: ModelosService,
    private opcionaisService: OpcionaisService,
  ) {}

  async findAll(): Promise<ModeloOpcional[]> {
    return this.modeloOpcionalRepository.find({
      relations: ['modelo', 'opcional', 'modelo.marca'],
      order: {
        modeloId: 'ASC',
        opcionalId: 'ASC',
      },
    });
  }

  async findByModeloId(modeloId: number): Promise<ModeloOpcional[]> {
    return this.modeloOpcionalRepository.find({
      where: { modeloId },
      relations: ['modelo', 'opcional', 'modelo.marca'],
      order: {
        opcionalId: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<ModeloOpcional> {
    const modeloOpcional = await this.modeloOpcionalRepository.findOne({
      where: { id },
      relations: ['modelo', 'opcional', 'modelo.marca'],
    });
    
    if (!modeloOpcional) {
      throw new NotFoundException(`Associação com ID ${id} não encontrada`);
    }
    
    return modeloOpcional;
  }

  async create(modeloOpcionalDto: ModeloOpcionalDto): Promise<ModeloOpcional> {
    // Verificar se o modelo existe
    await this.modelosService.findOne(modeloOpcionalDto.modeloId);
    
    // Verificar se o opcional existe
    await this.opcionaisService.findOne(modeloOpcionalDto.opcionalId);
    
    // Verificar se já existe uma associação para este modelo e opcional
    const existingAssociation = await this.modeloOpcionalRepository.findOne({
      where: {
        modeloId: modeloOpcionalDto.modeloId,
        opcionalId: modeloOpcionalDto.opcionalId,
      },
      relations: ['modelo', 'opcional', 'modelo.marca'],
    });
    
    if (existingAssociation) {
      // Atualizar o preço se já existir
      existingAssociation.preco = modeloOpcionalDto.preco;
      return this.modeloOpcionalRepository.save(existingAssociation);
    }
    
    // Criar nova associação
    const modeloOpcional = this.modeloOpcionalRepository.create(modeloOpcionalDto);
    return this.modeloOpcionalRepository.save(modeloOpcional);
  }

  async update(id: number, updateModeloOpcionalDto: UpdateModeloOpcionalDto): Promise<ModeloOpcional> {
    const modeloOpcional = await this.findOne(id);
    
    // Verificar se o modelo existe
    if (updateModeloOpcionalDto.modeloId) {
      await this.modelosService.findOne(updateModeloOpcionalDto.modeloId);
    }
    
    // Verificar se o opcional existe
    if (updateModeloOpcionalDto.opcionalId) {
      await this.opcionaisService.findOne(updateModeloOpcionalDto.opcionalId);
    }
    
    this.modeloOpcionalRepository.merge(modeloOpcional, updateModeloOpcionalDto);
    return this.modeloOpcionalRepository.save(modeloOpcional);
  }

  async remove(id: number): Promise<void> {
    const modeloOpcional = await this.findOne(id);
    await this.modeloOpcionalRepository.remove(modeloOpcional);
  }
}
