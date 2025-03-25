import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendaDireta } from '../entities/venda-direta.entity';
import { CreateVendaDiretaDto, UpdateVendaDiretaDto } from '../dto/venda-direta.dto';
import { MarcasService } from './marcas.service';

@Injectable()
export class VendaDiretaService {
  constructor(
    @InjectRepository(VendaDireta)
    private vendaDiretaRepository: Repository<VendaDireta>,
    private marcasService: MarcasService,
  ) {}

  async findAll(page = 1, limit = 10, marcaId?: number) {
    try {
      const queryBuilder = this.vendaDiretaRepository.createQueryBuilder('vendaDireta')
        .orderBy('vendaDireta.createdAt', 'DESC');

      // Filtrar por marca se fornecido
      if (marcaId) {
        queryBuilder.where('vendaDireta.marcaId = :marcaId', { marcaId });
      }

      const [items, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      // Para cada venda direta, buscar o nome da marca
      const itemsWithMarcaName = await Promise.all(
        items.map(async (item) => {
          if (item.marcaId) {
            try {
              const marca = await this.marcasService.findOne(item.marcaId);
              return {
                ...item,
                marca: {
                  id: marca.id,
                  nome: marca.nome
                }
              };
            } catch (error) {
              // Se não encontrar a marca, retorna o item sem informações da marca
              console.log(`Marca com ID ${item.marcaId} não encontrada para a venda direta ${item.id}`);
              return {
                ...item,
                marca: null
              };
            }
          }
          return {
            ...item,
            marca: null
          };
        })
      );

      return {
        items: itemsWithMarcaName,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Erro ao buscar vendas diretas:', error);
      // Retornar um resultado vazio em vez de propagar o erro
      return {
        items: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  }

  async findOne(id: number) {
    try {
      const vendaDireta = await this.vendaDiretaRepository.findOne({
        where: { id }
      });
      
      if (!vendaDireta) {
        throw new NotFoundException(`Venda Direta com ID ${id} não encontrada`);
      }
      
      // Buscar informações da marca
      if (vendaDireta.marcaId) {
        try {
          const marca = await this.marcasService.findOne(vendaDireta.marcaId);
          return {
            ...vendaDireta,
            marca: {
              id: marca.id,
              nome: marca.nome
            }
          };
        } catch (error) {
          console.log(`Marca com ID ${vendaDireta.marcaId} não encontrada para a venda direta ${id}`);
          return {
            ...vendaDireta,
            marca: null
          };
        }
      }
      
      return {
        ...vendaDireta,
        marca: null
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Erro ao buscar venda direta ${id}:`, error);
      throw new NotFoundException(`Venda Direta com ID ${id} não encontrada`);
    }
  }

  async create(createVendaDiretaDto: CreateVendaDiretaDto) {
    try {
      // Verificar se a marca existe
      if (createVendaDiretaDto.marcaId) {
        await this.marcasService.findOne(createVendaDiretaDto.marcaId);
      }
      
      const vendaDireta = this.vendaDiretaRepository.create(createVendaDiretaDto);
      return this.vendaDiretaRepository.save(vendaDireta);
    } catch (error) {
      console.error('Erro ao criar venda direta:', error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Marca com ID ${createVendaDiretaDto.marcaId} não encontrada`);
      }
      throw error;
    }
  }

  async update(id: number, updateVendaDiretaDto: UpdateVendaDiretaDto) {
    try {
      // Verificar se a venda direta existe
      await this.findOne(id);
      
      // Verificar se a marca existe, se fornecida
      if (updateVendaDiretaDto.marcaId) {
        await this.marcasService.findOne(updateVendaDiretaDto.marcaId);
      }
      
      await this.vendaDiretaRepository.update(id, updateVendaDiretaDto);
      return this.findOne(id);
    } catch (error) {
      console.error(`Erro ao atualizar venda direta ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Erro ao atualizar venda direta com ID ${id}`);
    }
  }

  async remove(id: number) {
    try {
      const vendaDireta = await this.findOne(id);
      return this.vendaDiretaRepository.remove(vendaDireta as VendaDireta);
    } catch (error) {
      console.error(`Erro ao remover venda direta ${id}:`, error);
      throw error;
    }
  }
}
