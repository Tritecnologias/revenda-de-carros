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
exports.ModelosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const modelo_entity_1 = require("../entities/modelo.entity");
const marcas_service_1 = require("./marcas.service");
let ModelosService = class ModelosService {
    constructor(modelosRepository, marcasService) {
        this.modelosRepository = modelosRepository;
        this.marcasService = marcasService;
    }
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
    async findByMarca(marcaId) {
        console.log(`Buscando modelos para a marca ID: ${marcaId}`);
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
    async findOne(id) {
        const modelo = await this.modelosRepository.findOne({
            where: { id },
            relations: ['marca'],
        });
        if (!modelo) {
            throw new common_1.NotFoundException(`Modelo com ID ${id} não encontrado`);
        }
        return modelo;
    }
    async create(createModeloDto) {
        await this.marcasService.findOne(createModeloDto.marcaId);
        const existingModelo = await this.modelosRepository.findOne({
            where: {
                marcaId: createModeloDto.marcaId,
                nome: createModeloDto.nome,
            },
        });
        if (existingModelo) {
            throw new common_1.ConflictException(`Já existe um modelo com o nome ${createModeloDto.nome} para esta marca`);
        }
        const modelo = this.modelosRepository.create(createModeloDto);
        return this.modelosRepository.save(modelo);
    }
    async update(id, updateModeloDto) {
        const modelo = await this.findOne(id);
        if (updateModeloDto.marcaId) {
            await this.marcasService.findOne(updateModeloDto.marcaId);
        }
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
                throw new common_1.ConflictException(`Já existe um modelo com o nome ${nome} para esta marca`);
            }
        }
        await this.modelosRepository.update(id, updateModeloDto);
        return this.findOne(id);
    }
    async remove(id) {
        const modelo = await this.findOne(id);
        return this.modelosRepository.remove(modelo);
    }
};
exports.ModelosService = ModelosService;
exports.ModelosService = ModelosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(modelo_entity_1.Modelo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        marcas_service_1.MarcasService])
], ModelosService);
//# sourceMappingURL=modelos.service.js.map