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
exports.MarcasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const marca_entity_1 = require("../entities/marca.entity");
let MarcasService = class MarcasService {
    constructor(marcasRepository) {
        this.marcasRepository = marcasRepository;
    }
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
    async findOne(id) {
        const marca = await this.marcasRepository.findOne({ where: { id } });
        if (!marca) {
            throw new common_1.NotFoundException(`Marca com ID ${id} não encontrada`);
        }
        return marca;
    }
    async create(createMarcaDto) {
        const existingMarca = await this.marcasRepository.findOne({
            where: { nome: createMarcaDto.nome },
        });
        if (existingMarca) {
            throw new common_1.ConflictException(`Já existe uma marca com o nome ${createMarcaDto.nome}`);
        }
        const marca = this.marcasRepository.create(createMarcaDto);
        return this.marcasRepository.save(marca);
    }
    async update(id, updateMarcaDto) {
        const marca = await this.findOne(id);
        if (updateMarcaDto.nome) {
            const existingMarca = await this.marcasRepository.findOne({
                where: { nome: updateMarcaDto.nome },
            });
            if (existingMarca && existingMarca.id !== id) {
                throw new common_1.ConflictException(`Já existe uma marca com o nome ${updateMarcaDto.nome}`);
            }
        }
        await this.marcasRepository.update(id, updateMarcaDto);
        return this.findOne(id);
    }
    async remove(id) {
        const marca = await this.findOne(id);
        return this.marcasRepository.remove(marca);
    }
};
exports.MarcasService = MarcasService;
exports.MarcasService = MarcasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(marca_entity_1.Marca)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MarcasService);
//# sourceMappingURL=marcas.service.js.map