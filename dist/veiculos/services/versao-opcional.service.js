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
exports.VersaoOpcionalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const versao_opcional_entity_1 = require("../entities/versao-opcional.entity");
const versoes_service_1 = require("./versoes.service");
const opcionais_service_1 = require("./opcionais.service");
let VersaoOpcionalService = class VersaoOpcionalService {
    constructor(versaoOpcionalRepository, versoesService, opcionaisService) {
        this.versaoOpcionalRepository = versaoOpcionalRepository;
        this.versoesService = versoesService;
        this.opcionaisService = opcionaisService;
    }
    async findAll(page = 1, limit = 10, versaoId) {
        try {
            const tableExists = await this.versaoOpcionalRepository.query("SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'versao_opcional' LIMIT 1");
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
        }
        catch (error) {
            console.error('Erro ao buscar lista de versão-opcional:', error);
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
        const versaoOpcional = await this.versaoOpcionalRepository.findOne({
            where: { id },
            relations: ['versao', 'opcional', 'versao.modelo'],
        });
        if (!versaoOpcional) {
            throw new common_1.NotFoundException(`Associação de versão-opcional com ID ${id} não encontrada`);
        }
        return versaoOpcional;
    }
    async findByVersao(versaoId) {
        await this.versoesService.findOne(versaoId);
        const opcionais = await this.versaoOpcionalRepository.find({
            where: { versao_id: versaoId },
            relations: ['opcional'],
        });
        return opcionais;
    }
    async create(createVersaoOpcionalDto) {
        await this.versoesService.findOne(createVersaoOpcionalDto.versao_id);
        await this.opcionaisService.findOne(createVersaoOpcionalDto.opcional_id);
        const existingAssociation = await this.versaoOpcionalRepository.findOne({
            where: {
                versao_id: createVersaoOpcionalDto.versao_id,
                opcional_id: createVersaoOpcionalDto.opcional_id,
            },
        });
        if (existingAssociation) {
            throw new common_1.ConflictException(`Já existe uma associação entre a versão ${createVersaoOpcionalDto.versao_id} e o opcional ${createVersaoOpcionalDto.opcional_id}`);
        }
        const versaoOpcional = this.versaoOpcionalRepository.create(createVersaoOpcionalDto);
        return this.versaoOpcionalRepository.save(versaoOpcional);
    }
    async update(id, updateVersaoOpcionalDto) {
        const versaoOpcional = await this.findOne(id);
        if (updateVersaoOpcionalDto.versao_id) {
            await this.versoesService.findOne(updateVersaoOpcionalDto.versao_id);
        }
        if (updateVersaoOpcionalDto.opcional_id) {
            await this.opcionaisService.findOne(updateVersaoOpcionalDto.opcional_id);
        }
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
                throw new common_1.ConflictException(`Já existe uma associação entre a versão ${versao_id} e o opcional ${opcional_id}`);
            }
        }
        Object.assign(versaoOpcional, updateVersaoOpcionalDto);
        return this.versaoOpcionalRepository.save(versaoOpcional);
    }
    async remove(id) {
        const versaoOpcional = await this.findOne(id);
        return this.versaoOpcionalRepository.remove(versaoOpcional);
    }
    async findByVersaoPublic(versaoId) {
        await this.versoesService.findOne(versaoId);
        const opcionais = await this.versaoOpcionalRepository.find({
            where: { versao_id: versaoId },
            relations: ['opcional'],
        });
        return opcionais;
    }
};
exports.VersaoOpcionalService = VersaoOpcionalService;
exports.VersaoOpcionalService = VersaoOpcionalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(versao_opcional_entity_1.VersaoOpcional)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        versoes_service_1.VersoesService,
        opcionais_service_1.OpcionaisService])
], VersaoOpcionalService);
//# sourceMappingURL=versao-opcional.service.js.map