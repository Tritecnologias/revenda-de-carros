import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marca } from '../entities/marca.entity';
import { CreateMarcaDto, UpdateMarcaDto } from '../dto/marca.dto';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private marcasRepository: Repository<Marca>,
  ) {}

  async findAll(page = 1, limit = 10) {
    const [items, total] = await this.marcasRepository.findAndCount({
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
    console.log('MarcasService: Buscando todas as marcas ativas');
    const marcas = await this.marcasRepository.find({
      order: { nome: 'ASC' },
    });
    console.log(`MarcasService: Encontradas ${marcas.length} marcas`);
    return marcas;
  }

  async findOne(id: number) {
    const marca = await this.marcasRepository.findOne({ where: { id } });
    if (!marca) {
      throw new NotFoundException(`Marca com ID ${id} não encontrada`);
    }
    return marca;
  }

  async create(createMarcaDto: CreateMarcaDto) {
    // Verificar se já existe uma marca com o mesmo nome
    const existingMarca = await this.marcasRepository.findOne({
      where: { nome: createMarcaDto.nome },
    });

    if (existingMarca) {
      throw new ConflictException(`Já existe uma marca com o nome ${createMarcaDto.nome}`);
    }

    const marca = this.marcasRepository.create(createMarcaDto);
    return this.marcasRepository.save(marca);
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    // Verificar se a marca existe
    const marca = await this.findOne(id);

    // Verificar se já existe outra marca com o mesmo nome
    if (updateMarcaDto.nome) {
      const existingMarca = await this.marcasRepository.findOne({
        where: { nome: updateMarcaDto.nome },
      });

      if (existingMarca && existingMarca.id !== id) {
        throw new ConflictException(`Já existe uma marca com o nome ${updateMarcaDto.nome}`);
      }
    }

    // Atualizar a marca
    await this.marcasRepository.update(id, updateMarcaDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const marca = await this.findOne(id);
    return this.marcasRepository.remove(marca);
  }
}
