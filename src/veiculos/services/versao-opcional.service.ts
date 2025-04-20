import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VersaoOpcional } from '../entities/versao-opcional.entity';
import { CreateVersaoOpcionalDto, UpdateVersaoOpcionalDto } from '../dto/versao-opcional.dto';
import { VersoesService } from './versoes.service';
import { OpcionaisService } from './opcionais.service';

@Injectable()
export class VersaoOpcionalService {
  constructor(
    @InjectRepository(VersaoOpcional)
    private versaoOpcionalRepository: Repository<VersaoOpcional>,
    private versoesService: VersoesService,
    private opcionaisService: OpcionaisService,
  ) {}

  async findAll(page = 1, limit = 10, versaoId?: number) {
    try {
      // Verificar se a tabela existe antes de tentar acessá-la
      const tableExists = await this.versaoOpcionalRepository.query(
        "SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'versao_opcional' LIMIT 1"
      );
      
      if (!tableExists || tableExists.length === 0) {
        console.error('A tabela versao_opcional não existe no banco de dados');
        return {
          items: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }
      
      const queryBuilder = this.versaoOpcionalRepository.createQueryBuilder('versao_opcional')
        .leftJoinAndSelect('versao_opcional.versao', 'versao')
        .leftJoinAndSelect('versao_opcional.opcional', 'opcional')
        .leftJoinAndSelect('versao.modelo', 'modelo')
        .orderBy('versao_opcional.created_at', 'DESC');

      // Filtrar por versão se fornecido
      if (versaoId) {
        queryBuilder.where('versao_opcional.versao_id = :versaoId', { versaoId });
      }

      const [items, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Erro ao buscar lista de versão-opcional:', error);
      // Retornar uma lista vazia em vez de lançar um erro
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
    const versaoOpcional = await this.versaoOpcionalRepository.findOne({
      where: { id },
      relations: ['versao', 'opcional', 'versao.modelo'],
    });
    
    if (!versaoOpcional) {
      throw new NotFoundException(`Associação de versão-opcional com ID ${id} não encontrada`);
    }
    
    return versaoOpcional;
  }

  async findByVersao(versaoId: number) {
    // Verificar se a versão existe
    await this.versoesService.findOne(versaoId);

    const opcionais = await this.versaoOpcionalRepository.find({
      where: { versao_id: versaoId },
      relations: ['opcional'],
    });

    return opcionais;
  }

  async create(createVersaoOpcionalDto: CreateVersaoOpcionalDto) {
    // Verificar se a versão existe
    await this.versoesService.findOne(createVersaoOpcionalDto.versao_id);

    // Verificar se o opcional existe
    await this.opcionaisService.findOne(createVersaoOpcionalDto.opcional_id);

    // Verificar se já existe uma associação entre esta versão e este opcional
    const existingAssociation = await this.versaoOpcionalRepository.findOne({
      where: {
        versao_id: createVersaoOpcionalDto.versao_id,
        opcional_id: createVersaoOpcionalDto.opcional_id,
      },
    });

    if (existingAssociation) {
      throw new ConflictException(
        `Já existe uma associação entre a versão ${createVersaoOpcionalDto.versao_id} e o opcional ${createVersaoOpcionalDto.opcional_id}`,
      );
    }

    const versaoOpcional = this.versaoOpcionalRepository.create(createVersaoOpcionalDto);
    return this.versaoOpcionalRepository.save(versaoOpcional);
  }

  async update(id: number, updateVersaoOpcionalDto: UpdateVersaoOpcionalDto) {
    const versaoOpcional = await this.findOne(id);

    // Se estiver atualizando a versão, verificar se a nova versão existe
    if (updateVersaoOpcionalDto.versao_id) {
      await this.versoesService.findOne(updateVersaoOpcionalDto.versao_id);
    }

    // Se estiver atualizando o opcional, verificar se o novo opcional existe
    if (updateVersaoOpcionalDto.opcional_id) {
      await this.opcionaisService.findOne(updateVersaoOpcionalDto.opcional_id);
    }

    // Se estiver alterando a versão ou o opcional, verificar se já existe uma associação
    if (updateVersaoOpcionalDto.versao_id || updateVersaoOpcionalDto.opcional_id) {
      const versao_id = updateVersaoOpcionalDto.versao_id || versaoOpcional.versao_id;
      const opcional_id = updateVersaoOpcionalDto.opcional_id || versaoOpcional.opcional_id;

      const existingAssociation = await this.versaoOpcionalRepository.findOne({
        where: {
          versao_id,
          opcional_id,
        },
      });

      if (existingAssociation && existingAssociation.id !== id) {
        throw new ConflictException(
          `Já existe uma associação entre a versão ${versao_id} e o opcional ${opcional_id}`,
        );
      }
    }

    // Atualizar a entidade
    Object.assign(versaoOpcional, updateVersaoOpcionalDto);
    return this.versaoOpcionalRepository.save(versaoOpcional);
  }

  async remove(id: number) {
    const versaoOpcional = await this.findOne(id);
    return this.versaoOpcionalRepository.remove(versaoOpcional);
  }

  async findByVersaoPublic(versaoId: number) {
    // Verificar se a versão existe
    await this.versoesService.findOne(versaoId);

    const opcionais = await this.versaoOpcionalRepository.find({
      where: { versao_id: versaoId },
      relations: ['opcional'],
    });

    return opcionais;
  }
}
