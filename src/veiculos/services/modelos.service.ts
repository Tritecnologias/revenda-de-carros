import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modelo } from '../entities/modelo.entity';
import { CreateModeloDto, UpdateModeloDto } from '../dto/modelo.dto';
import { MarcasService } from './marcas.service';

@Injectable()
export class ModelosService {
  constructor(
    @InjectRepository(Modelo)
    private modelosRepository: Repository<Modelo>,
    private marcasService: MarcasService,
  ) {}

  async findAll(page = 1, limit = 10) {
    const [items, total] = await this.modelosRepository.findAndCount({
      relations: ['marca'],
      order: { nome: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllActive() {
    const modelos = await this.modelosRepository.find({
      where: { status: 'ativo' },
      relations: ['marca'],
      order: { nome: 'ASC' },
    });
    
    return modelos;
  }

  async findByMarca(marcaId: number) {
    console.log(`Buscando modelos para a marca ID: ${marcaId}`);
    
    // Verificar se a marca existe
    const marca = await this.marcasService.findOne(marcaId);
    if (!marca) {
      console.log(`Marca ID ${marcaId} não encontrada`);
      return [];
    }
    
    const modelos = await this.modelosRepository.find({
      where: { marcaId: marcaId, status: 'ativo' },
      order: { nome: 'ASC' },
    });
    
    console.log(`Encontrados ${modelos.length} modelos para a marca ID: ${marcaId}`);
    return modelos;
  }

  async findOne(id: number) {
    const modelo = await this.modelosRepository.findOne({
      where: { id },
      relations: ['marca'],
    });
    
    if (!modelo) {
      throw new NotFoundException(`Modelo com ID ${id} não encontrado`);
    }
    
    return modelo;
  }

  async create(createModeloDto: CreateModeloDto) {
    // Verificar se a marca existe
    await this.marcasService.findOne(createModeloDto.marcaId);

    // Verificar se já existe um modelo com o mesmo nome para a mesma marca
    const existingModelo = await this.modelosRepository.findOne({
      where: {
        marcaId: createModeloDto.marcaId,
        nome: createModeloDto.nome,
      },
    });

    if (existingModelo) {
      throw new ConflictException(`Já existe um modelo com o nome ${createModeloDto.nome} para esta marca`);
    }

    const modelo = this.modelosRepository.create(createModeloDto);
    return this.modelosRepository.save(modelo);
  }

  async update(id: number, updateModeloDto: UpdateModeloDto) {
    // Verificar se o modelo existe
    const modelo = await this.findOne(id);

    // Verificar se a marca existe, se foi fornecida
    if (updateModeloDto.marcaId) {
      await this.marcasService.findOne(updateModeloDto.marcaId);
    }

    // Verificar se já existe outro modelo com o mesmo nome para a mesma marca
    if (updateModeloDto.nome || updateModeloDto.marcaId) {
      const marcaId = updateModeloDto.marcaId || modelo.marcaId;
      const nome = updateModeloDto.nome || modelo.nome;

      const existingModelo = await this.modelosRepository.findOne({
        where: {
          marcaId,
          nome,
        },
      });

      if (existingModelo && existingModelo.id !== id) {
        throw new ConflictException(`Já existe um modelo com o nome ${nome} para esta marca`);
      }
    }

    // Atualizar o modelo
    await this.modelosRepository.update(id, updateModeloDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const modelo = await this.findOne(id);
    return this.modelosRepository.remove(modelo);
  }
}
