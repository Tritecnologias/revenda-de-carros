import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opcional } from '../entities/opcional.entity';
import { OpcionalDto, UpdateOpcionalDto } from '../dto/opcional.dto';

@Injectable()
export class OpcionaisService {
  constructor(
    @InjectRepository(Opcional)
    private opcionaisRepository: Repository<Opcional>,
  ) {}

  async findAll(): Promise<Opcional[]> {
    return this.opcionaisRepository.find({
      order: {
        codigo: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Opcional> {
    const opcional = await this.opcionaisRepository.findOne({ where: { id } });
    if (!opcional) {
      throw new NotFoundException(`Opcional com ID ${id} não encontrado`);
    }
    return opcional;
  }

  async create(opcionalDto: OpcionalDto): Promise<Opcional> {
    const opcional = this.opcionaisRepository.create(opcionalDto);
    return this.opcionaisRepository.save(opcional);
  }

  async update(id: number, updateOpcionalDto: UpdateOpcionalDto): Promise<Opcional> {
    const opcional = await this.findOne(id);
    this.opcionaisRepository.merge(opcional, updateOpcionalDto);
    return this.opcionaisRepository.save(opcional);
  }

  async remove(id: number): Promise<void> {
    const opcional = await this.findOne(id);
    await this.opcionaisRepository.remove(opcional);
  }
}
