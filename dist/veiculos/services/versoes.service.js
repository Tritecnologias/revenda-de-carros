"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var VersoesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersoesService = exports.UpdateVersaoDto = exports.CreateVersaoDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const versao_entity_1 = require("../entities/versao.entity");
const veiculo_entity_1 = require("../entities/veiculo.entity");
const modelos_service_1 = require("./modelos.service");
class CreateVersaoDto {
}
exports.CreateVersaoDto = CreateVersaoDto;
class UpdateVersaoDto {
}
exports.UpdateVersaoDto = UpdateVersaoDto;
let VersoesService = VersoesService_1 = class VersoesService {
    constructor(versaoRepository, veiculosRepository, modelosService) {
        this.versaoRepository = versaoRepository;
        this.veiculosRepository = veiculosRepository;
        this.modelosService = modelosService;
        this.logger = new common_1.Logger(VersoesService_1.name);
    }
    async findAll() {
        try {
            this.logger.log('Buscando todas as versões');
            const versoes = await this.versaoRepository.find({
                relations: ['modelo', 'modelo.marca'],
            });
            this.logger.log(`Encontradas ${versoes.length} versões`);
            return versoes;
        }
        catch (error) {
            this.logger.error(`Erro ao buscar versões: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Erro ao buscar versões: ${error.message}`);
        }
    }
    async findAllRaw() {
        try {
            this.logger.log('Buscando todas as versões com SQL direto');
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
        }
        catch (error) {
            this.logger.error(`Erro ao buscar versões com SQL direto: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Erro ao buscar versões: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            this.logger.log(`Buscando versão com ID: ${id}`);
            const versao = await this.versaoRepository.findOne({
                where: { id },
                relations: ['modelo', 'modelo.marca'],
            });
            if (!versao) {
                this.logger.warn(`Versão com ID ${id} não encontrada`);
                throw new common_1.NotFoundException(`Versão com ID ${id} não encontrada`);
            }
            this.logger.log(`Versão com ID ${id} encontrada`);
            return versao;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Erro ao buscar versão com ID ${id}: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Erro ao buscar versão: ${error.message}`);
        }
    }
    async findByModelo(modeloId) {
        try {
            this.logger.log(`Buscando versões para o modelo com ID: ${modeloId}`);
            const versoes = await this.versaoRepository.find({
                where: { modeloId },
                relations: ['modelo', 'modelo.marca'],
            });
            this.logger.log(`Encontradas ${versoes.length} versões para o modelo ${modeloId}`);
            const result = await Promise.all(versoes.map(async (versao) => {
                try {
                    this.logger.log(`Buscando veículo por versaoId: ${versao.id}, modeloId: ${versao.modeloId}`);
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
                }
                catch (error) {
                    this.logger.error(`Erro ao buscar veículo para versão ${versao.id}: ${error.message}`, error.stack);
                    return {
                        ...versao,
                        veiculoId: null,
                        veiculo: null,
                    };
                }
            }));
            return result;
        }
        catch (error) {
            this.logger.error(`Erro ao buscar versões para o modelo ${modeloId}: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Erro ao buscar versões para o modelo: ${error.message}`);
        }
    }
    async findByModeloRaw(modeloId) {
        try {
            this.logger.log(`Buscando versões para o modelo ${modeloId} com SQL direto`);
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
        }
        catch (error) {
            this.logger.error(`Erro ao buscar versões para o modelo ${modeloId} com SQL direto: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Erro ao buscar versões para o modelo ${modeloId}: ${error.message}`);
        }
    }
    async create(createVersaoDto) {
        try {
            this.logger.log(`Criando nova versão: ${JSON.stringify(createVersaoDto)}`);
            await this.modelosService.findOne(createVersaoDto.modeloId);
            const versao = this.versaoRepository.create(createVersaoDto);
            const result = await this.versaoRepository.save(versao);
            this.logger.log(`Versão criada com sucesso, ID: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Erro ao criar versão: ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(id, updateVersaoDto) {
        try {
            this.logger.log(`Atualizando versão com ID ${id}: ${JSON.stringify(updateVersaoDto)}`);
            const versao = await this.findOne(id);
            if (updateVersaoDto.modeloId) {
                await this.modelosService.findOne(updateVersaoDto.modeloId);
            }
            this.versaoRepository.merge(versao, updateVersaoDto);
            const result = await this.versaoRepository.save(versao);
            this.logger.log(`Versão com ID ${id} atualizada com sucesso`);
            return result;
        }
        catch (error) {
            this.logger.error(`Erro ao atualizar versão com ID ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            this.logger.log(`Removendo versão com ID ${id}`);
            const versao = await this.findOne(id);
            await this.versaoRepository.remove(versao);
            this.logger.log(`Versão com ID ${id} removida com sucesso`);
        }
        catch (error) {
            this.logger.error(`Erro ao remover versão com ID ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.VersoesService = VersoesService;
exports.VersoesService = VersoesService = VersoesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(versao_entity_1.Versao)),
    __param(1, (0, typeorm_1.InjectRepository)(veiculo_entity_1.Veiculo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        modelos_service_1.ModelosService])
], VersoesService);
//# sourceMappingURL=versoes.service.js.map