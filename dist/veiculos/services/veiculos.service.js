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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeiculosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const veiculo_entity_1 = require("../entities/veiculo.entity");
const marcas_service_1 = require("./marcas.service");
const modelos_service_1 = require("./modelos.service");
const versoes_service_1 = require("./versoes.service");
let VeiculosService = class VeiculosService {
    constructor(veiculosRepository, marcasService, modelosService, versoesService) {
        this.veiculosRepository = veiculosRepository;
        this.marcasService = marcasService;
        this.modelosService = modelosService;
        this.versoesService = versoesService;
    }
    async findAll(page = 1, limit = 10, modeloId) {
        try {
            console.log(`VeiculosService: Buscando veículos - página ${page}, limite ${limit}, modeloId: ${modeloId || 'não especificado'}`);
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
            console.log(`VeiculosService: Encontrados ${items.length} veículos de um total de ${total}`);
            return {
                items,
                meta: {
                    totalItems: total,
                    itemCount: items.length,
                    itemsPerPage: limit,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page
                }
            };
        }
        catch (error) {
            console.error('VeiculosService: Erro ao buscar veículos:', error);
            throw error;
        }
    }
    async findOne(id) {
        const veiculo = await this.veiculosRepository.findOne({
            where: { id },
            relations: ['marca', 'modelo', 'versao'],
        });
        if (!veiculo) {
            throw new common_1.NotFoundException(`Veículo com ID ${id} não encontrado`);
        }
        return veiculo;
    }
    async create(createVeiculoDto) {
        await this.marcasService.findOne(createVeiculoDto.marcaId);
        await this.modelosService.findOne(createVeiculoDto.modeloId);
        await this.versoesService.findOne(createVeiculoDto.versaoId);
        const veiculo = this.veiculosRepository.create(createVeiculoDto);
        return this.veiculosRepository.save(veiculo);
    }
    async update(id, updateVeiculoDto) {
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
        return this.findOne(id);
    }
    async remove(id) {
        const veiculo = await this.findOne(id);
        return this.veiculosRepository.remove(veiculo);
    }
};
exports.VeiculosService = VeiculosService;
exports.VeiculosService = VeiculosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(veiculo_entity_1.Veiculo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        marcas_service_1.MarcasService,
        modelos_service_1.ModelosService,
        versoes_service_1.VersoesService])
], VeiculosService);
//# sourceMappingURL=veiculos.service.js.map