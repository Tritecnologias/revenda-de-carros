import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(VersoesService.name);

  constructor(
    @InjectRepository(Versao)
    private versaoRepository: Repository<Versao>,
    @InjectRepository(Veiculo)
    private veiculosRepository: Repository<Veiculo>,
    private modelosService: ModelosService,
  ) {}

  async findAll(): Promise<Versao[]> {
    try {
      this.logger.log('Buscando todas as versões');
      const versoes = await this.versaoRepository.find({
        relations: ['modelo', 'modelo.marca'],
      });
      this.logger.log(`Encontradas ${versoes.length} versões`);
      return versoes;
    } catch (error) {
      this.logger.error(`Erro ao buscar versões: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erro ao buscar versões: ${error.message}`);
    }
  }

  async findAllRaw(): Promise<any[]> {
    try {
      this.logger.log('Buscando todas as versões com SQL direto');
      
      // Usar o EntityManager para executar SQL direto
      // Esta consulta é compatível tanto com MySQL 5 quanto com MySQL 8
      const versoes = await this.versaoRepository.query(`
        SELECT 
          v.id, 
          v.nome_versao, 
          v.status, 
          v.modeloId,
          v.createdAt,
          v.updatedAt,
          m.id as modelo_id,
          m.nome as modelo_nome,
          ma.id as marca_id,
          ma.nome as marca_nome
        FROM 
          versao v
        LEFT JOIN 
          modelo m ON v.modeloId = m.id
        LEFT JOIN 
          marca ma ON m.marcaId = ma.id
        ORDER BY 
          v.id DESC
      `);
      
      // Transformar o resultado para o formato esperado pelo frontend
      const result = versoes.map(v => ({
        id: v.id,
        nome_versao: v.nome_versao,
        status: v.status,
        modeloId: v.modeloId,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        modelo: {
          id: v.modelo_id,
          nome: v.modelo_nome,
          marca: {
            id: v.marca_id,
            nome: v.marca_nome
          }
        }
      }));
      
      this.logger.log(`Encontradas ${result.length} versões com SQL direto`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao buscar versões com SQL direto: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erro ao buscar versões: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Versao> {
    try {
      this.logger.log(`Buscando versão com ID: ${id}`);
      const versao = await this.versaoRepository.findOne({
        where: { id },
        relations: ['modelo', 'modelo.marca'],
      });
      
      if (!versao) {
        this.logger.warn(`Versão com ID ${id} não encontrada`);
        throw new NotFoundException(`Versão com ID ${id} não encontrada`);
      }
      
      this.logger.log(`Versão com ID ${id} encontrada`);
      return versao;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar versão com ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erro ao buscar versão: ${error.message}`);
    }
  }

  async findByModelo(modeloId: number): Promise<any[]> {
    try {
      this.logger.log(`Buscando versões para o modelo com ID: ${modeloId}`);
      
      // Busca todas as versões do modelo
      const versoes = await this.versaoRepository.find({
        where: { modeloId },
        relations: ['modelo', 'modelo.marca'],
      });
      
      this.logger.log(`Encontradas ${versoes.length} versões para o modelo ${modeloId}`);

      // Para cada versão, busque o veículo mais recente associado a ela (por ano DESC)
      const result = await Promise.all(versoes.map(async versao => {
        try {
          // Log para depuração
          this.logger.log(`Buscando veículo por versaoId: ${versao.id}, modeloId: ${versao.modeloId}`);
          
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
        } catch (error) {
          this.logger.error(`Erro ao buscar veículo para versão ${versao.id}: ${error.message}`, error.stack);
          return {
            ...versao,
            veiculoId: null,
            veiculo: null,
          };
        }
      }));
      
      return result;
    } catch (error) {
      this.logger.error(`Erro ao buscar versões para o modelo ${modeloId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erro ao buscar versões para o modelo: ${error.message}`);
    }
  }

  async findByModeloRaw(modeloId: number): Promise<any[]> {
    try {
      this.logger.log(`Buscando versões para o modelo ${modeloId} com SQL direto`);
      
      // Usar o EntityManager para executar SQL direto
      // Esta consulta é compatível tanto com MySQL 5 quanto com MySQL 8
      const versoes = await this.versaoRepository.query(`
        SELECT 
          v.id, 
          v.nome_versao, 
          v.status, 
          v.modeloId,
          v.createdAt,
          v.updatedAt,
          m.id as modelo_id,
          m.nome as modelo_nome,
          ma.id as marca_id,
          ma.nome as marca_nome
        FROM 
          versao v
        LEFT JOIN 
          modelo m ON v.modeloId = m.id
        LEFT JOIN 
          marca ma ON m.marcaId = ma.id
        WHERE
          v.modeloId = ?
        ORDER BY 
          v.id DESC
      `, [modeloId]);
      
      // Transformar o resultado para o formato esperado pelo frontend
      const result = versoes.map(v => ({
        id: v.id,
        nome_versao: v.nome_versao,
        status: v.status,
        modeloId: v.modeloId,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        modelo: {
          id: v.modelo_id,
          nome: v.modelo_nome,
          marca: {
            id: v.marca_id,
            nome: v.marca_nome
          }
        }
      }));
      
      this.logger.log(`Encontradas ${result.length} versões para o modelo ${modeloId} com SQL direto`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao buscar versões para o modelo ${modeloId} com SQL direto: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erro ao buscar versões para o modelo ${modeloId}: ${error.message}`);
    }
  }

  async create(createVersaoDto: CreateVersaoDto): Promise<Versao> {
    try {
      this.logger.log(`Criando nova versão: ${JSON.stringify(createVersaoDto)}`);
      
      // Verificar se o modelo existe
      await this.modelosService.findOne(createVersaoDto.modeloId);
      
      const versao = this.versaoRepository.create(createVersaoDto);
      const result = await this.versaoRepository.save(versao);
      
      this.logger.log(`Versão criada com sucesso, ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao criar versão: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateVersaoDto: UpdateVersaoDto): Promise<Versao> {
    try {
      this.logger.log(`Atualizando versão com ID ${id}: ${JSON.stringify(updateVersaoDto)}`);
      
      const versao = await this.findOne(id);
      
      // Se o modeloId foi fornecido, verificar se o modelo existe
      if (updateVersaoDto.modeloId) {
        await this.modelosService.findOne(updateVersaoDto.modeloId);
      }
      
      this.versaoRepository.merge(versao, updateVersaoDto);
      const result = await this.versaoRepository.save(versao);
      
      this.logger.log(`Versão com ID ${id} atualizada com sucesso`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao atualizar versão com ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.log(`Removendo versão com ID ${id}`);
      
      const versao = await this.findOne(id);
      await this.versaoRepository.remove(versao);
      
      this.logger.log(`Versão com ID ${id} removida com sucesso`);
    } catch (error) {
      this.logger.error(`Erro ao remover versão com ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
