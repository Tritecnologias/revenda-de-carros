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
var VeiculosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeiculosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const veiculo_entity_1 = require("../entities/veiculo.entity");
const marcas_service_1 = require("./marcas.service");
const modelos_service_1 = require("./modelos.service");
const versoes_service_1 = require("./versoes.service");
let VeiculosService = VeiculosService_1 = class VeiculosService {
    constructor(veiculosRepository, marcasService, modelosService, versoesService) {
        this.veiculosRepository = veiculosRepository;
        this.marcasService = marcasService;
        this.modelosService = modelosService;
        this.versoesService = versoesService;
        this.logger = new common_1.Logger(VeiculosService_1.name);
    }
    async findAll(page = 1, limit = 10, modeloId) {
        try {
            this.logger.log(`Buscando veículos - página: ${page}, limite: ${limit}, modeloId: ${modeloId || 'não especificado'}`);
            const queryBuilder = this.veiculosRepository.createQueryBuilder('veiculo')
                .leftJoinAndSelect('veiculo.marca', 'marca')
                .leftJoinAndSelect('veiculo.modelo', 'modelo')
                .leftJoinAndSelect('veiculo.versao', 'versao')
                .orderBy('veiculo.createdAt', 'DESC');
            if (modeloId) {
                queryBuilder.where('veiculo.modeloId = :modeloId', { modeloId });
            }
            const [items, total] = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            this.logger.log(`Encontrados ${items.length} veículos de um total de ${total}`);
            return {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            this.logger.error(`Erro ao buscar veículos: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Erro ao buscar veículos: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            this.logger.log(`Buscando veículo com ID: ${id}`);
            const veiculo = await this.veiculosRepository.findOne({
                where: { id },
                relations: ['marca', 'modelo', 'versao'],
            });
            if (!veiculo) {
                this.logger.warn(`Veículo com ID ${id} não encontrado`);
                throw new common_1.NotFoundException(`Veículo com ID ${id} não encontrado`);
            }
            this.logger.log(`Veículo com ID ${id} encontrado`);
            return veiculo;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Erro ao buscar veículo com ID ${id}: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Erro ao buscar veículo: ${error.message}`);
        }
    }
    async create(createVeiculoDto) {
        try {
            this.logger.log(`Criando novo veículo: ${JSON.stringify(createVeiculoDto)}`);
            await this.marcasService.findOne(createVeiculoDto.marcaId);
            await this.modelosService.findOne(createVeiculoDto.modeloId);
            await this.versoesService.findOne(createVeiculoDto.versaoId);
            const veiculo = this.veiculosRepository.create(createVeiculoDto);
            const result = await this.veiculosRepository.save(veiculo);
            this.logger.log(`Veículo criado com sucesso, ID: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Erro ao criar veículo: ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(id, updateVeiculoDto) {
        try {
            this.logger.log(`Atualizando veículo com ID ${id}: ${JSON.stringify(updateVeiculoDto)}`);
            const veiculo = await this.findOne(id);
            if (updateVeiculoDto.marcaId) {
                await this.marcasService.findOne(updateVeiculoDto.marcaId);
            }
            if (updateVeiculoDto.modeloId) {
                await this.modelosService.findOne(updateVeiculoDto.modeloId);
            }
            if (updateVeiculoDto.versaoId) {
                await this.versoesService.findOne(updateVeiculoDto.versaoId);
            }
            await this.veiculosRepository.update(id, updateVeiculoDto);
            this.logger.log(`Veículo com ID ${id} atualizado com sucesso`);
            return this.findOne(id);
        }
        catch (error) {
            this.logger.error(`Erro ao atualizar veículo com ID ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            this.logger.log(`Removendo veículo com ID ${id}`);
            const veiculo = await this.findOne(id);
            const result = await this.veiculosRepository.remove(veiculo);
            this.logger.log(`Veículo com ID ${id} removido com sucesso`);
            return result;
        }
        catch (error) {
            this.logger.error(`Erro ao remover veículo com ID ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.VeiculosService = VeiculosService;
exports.VeiculosService = VeiculosService = VeiculosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(veiculo_entity_1.Veiculo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        marcas_service_1.MarcasService,
        modelos_service_1.ModelosService,
        versoes_service_1.VersoesService])
], VeiculosService);
//# sourceMappingURL=veiculos.service.js.map