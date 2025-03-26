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
exports.VendaDiretaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venda_direta_entity_1 = require("../entities/venda-direta.entity");
const marcas_service_1 = require("./marcas.service");
let VendaDiretaService = class VendaDiretaService {
    constructor(vendaDiretaRepository, marcasService) {
        this.vendaDiretaRepository = vendaDiretaRepository;
        this.marcasService = marcasService;
    }
    async findAll(page = 1, limit = 10, marcaId) {
        try {
            const queryBuilder = this.vendaDiretaRepository.createQueryBuilder('vendaDireta')
                .orderBy('vendaDireta.createdAt', 'DESC');
            if (marcaId) {
                queryBuilder.where('vendaDireta.marcaId = :marcaId', { marcaId });
            }
            const [items, total] = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            const itemsWithMarcaName = await Promise.all(items.map(async (item) => {
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
                    }
                    catch (error) {
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
            }));
            return {
                items: itemsWithMarcaName,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            console.error('Erro ao buscar vendas diretas:', error);
            return {
                items: [],
                total: 0,
                page,
                limit,
                totalPages: 0,
            };
        }
    }
    async findOne(id) {
        try {
            const vendaDireta = await this.vendaDiretaRepository.findOne({
                where: { id }
            });
            if (!vendaDireta) {
                throw new common_1.NotFoundException(`Venda Direta com ID ${id} não encontrada`);
            }
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
                }
                catch (error) {
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error(`Erro ao buscar venda direta ${id}:`, error);
            throw new common_1.NotFoundException(`Venda Direta com ID ${id} não encontrada`);
        }
    }
    async create(createVendaDiretaDto) {
        try {
            if (createVendaDiretaDto.marcaId) {
                await this.marcasService.findOne(createVendaDiretaDto.marcaId);
            }
            const vendaDireta = this.vendaDiretaRepository.create(createVendaDiretaDto);
            return this.vendaDiretaRepository.save(vendaDireta);
        }
        catch (error) {
            console.error('Erro ao criar venda direta:', error);
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException(`Marca com ID ${createVendaDiretaDto.marcaId} não encontrada`);
            }
            throw error;
        }
    }
    async update(id, updateVendaDiretaDto) {
        try {
            await this.findOne(id);
            if (updateVendaDiretaDto.marcaId) {
                await this.marcasService.findOne(updateVendaDiretaDto.marcaId);
            }
            await this.vendaDiretaRepository.update(id, updateVendaDiretaDto);
            return this.findOne(id);
        }
        catch (error) {
            console.error(`Erro ao atualizar venda direta ${id}:`, error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException(`Erro ao atualizar venda direta com ID ${id}`);
        }
    }
    async remove(id) {
        try {
            const vendaDireta = await this.findOne(id);
            return this.vendaDiretaRepository.remove(vendaDireta);
        }
        catch (error) {
            console.error(`Erro ao remover venda direta ${id}:`, error);
            throw error;
        }
    }
};
exports.VendaDiretaService = VendaDiretaService;
exports.VendaDiretaService = VendaDiretaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venda_direta_entity_1.VendaDireta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        marcas_service_1.MarcasService])
], VendaDiretaService);
//# sourceMappingURL=venda-direta.service.js.map