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
exports.ModeloOpcionalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const modelo_opcional_entity_1 = require("../entities/modelo-opcional.entity");
const modelos_service_1 = require("./modelos.service");
const opcionais_service_1 = require("./opcionais.service");
let ModeloOpcionalService = class ModeloOpcionalService {
    constructor(modeloOpcionalRepository, modelosService, opcionaisService) {
        this.modeloOpcionalRepository = modeloOpcionalRepository;
        this.modelosService = modelosService;
        this.opcionaisService = opcionaisService;
    }
    async findAll() {
        return this.modeloOpcionalRepository.find({
            relations: ['modelo', 'opcional', 'modelo.marca'],
            order: {
                modeloId: 'ASC',
                opcionalId: 'ASC',
            },
        });
    }
    async findByModeloId(modeloId) {
        return this.modeloOpcionalRepository.find({
            where: { modeloId },
            relations: ['modelo', 'opcional', 'modelo.marca'],
            order: {
                opcionalId: 'ASC',
            },
        });
    }
    async findOne(id) {
        const modeloOpcional = await this.modeloOpcionalRepository.findOne({
            where: { id },
            relations: ['modelo', 'opcional', 'modelo.marca'],
        });
        if (!modeloOpcional) {
            throw new common_1.NotFoundException(`Associação com ID ${id} não encontrada`);
        }
        return modeloOpcional;
    }
    async create(modeloOpcionalDto) {
        await this.modelosService.findOne(modeloOpcionalDto.modeloId);
        await this.opcionaisService.findOne(modeloOpcionalDto.opcionalId);
        const existingAssociation = await this.modeloOpcionalRepository.findOne({
            where: {
                modeloId: modeloOpcionalDto.modeloId,
                opcionalId: modeloOpcionalDto.opcionalId,
            },
            relations: ['modelo', 'opcional', 'modelo.marca'],
        });
        if (existingAssociation) {
            existingAssociation.preco = modeloOpcionalDto.preco;
            return this.modeloOpcionalRepository.save(existingAssociation);
        }
        const modeloOpcional = this.modeloOpcionalRepository.create(modeloOpcionalDto);
        return this.modeloOpcionalRepository.save(modeloOpcional);
    }
    async update(id, updateModeloOpcionalDto) {
        const modeloOpcional = await this.findOne(id);
        if (updateModeloOpcionalDto.modeloId) {
            await this.modelosService.findOne(updateModeloOpcionalDto.modeloId);
        }
        if (updateModeloOpcionalDto.opcionalId) {
            await this.opcionaisService.findOne(updateModeloOpcionalDto.opcionalId);
        }
        this.modeloOpcionalRepository.merge(modeloOpcional, updateModeloOpcionalDto);
        return this.modeloOpcionalRepository.save(modeloOpcional);
    }
    async remove(id) {
        const modeloOpcional = await this.findOne(id);
        await this.modeloOpcionalRepository.remove(modeloOpcional);
    }
};
exports.ModeloOpcionalService = ModeloOpcionalService;
exports.ModeloOpcionalService = ModeloOpcionalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(modelo_opcional_entity_1.ModeloOpcional)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        modelos_service_1.ModelosService,
        opcionais_service_1.OpcionaisService])
], ModeloOpcionalService);
//# sourceMappingURL=modelo-opcional.service.js.map