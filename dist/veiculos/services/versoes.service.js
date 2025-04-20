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
let VersoesService = class VersoesService {
    constructor(versaoRepository, veiculosRepository, modelosService) {
        this.versaoRepository = versaoRepository;
        this.veiculosRepository = veiculosRepository;
        this.modelosService = modelosService;
    }
    async findAll() {
        return this.versaoRepository.find({
            relations: ['modelo', 'modelo.marca'],
        });
    }
    async findOne(id) {
        const versao = await this.versaoRepository.findOne({
            where: { id },
            relations: ['modelo', 'modelo.marca'],
        });
        if (!versao) {
            throw new common_1.NotFoundException(`Versão com ID ${id} não encontrada`);
        }
        return versao;
    }
    async findByModelo(modeloId) {
        const versoes = await this.versaoRepository.find({
            where: { modeloId },
            relations: ['modelo', 'modelo.marca'],
        });
        const result = await Promise.all(versoes.map(async (versao) => {
            console.log('Buscando veiculo por versaoId:', versao.id, 'modeloId:', versao.modeloId);
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
        }));
        return result;
    }
    async create(createVersaoDto) {
        await this.modelosService.findOne(createVersaoDto.modeloId);
        const versao = this.versaoRepository.create(createVersaoDto);
        return this.versaoRepository.save(versao);
    }
    async update(id, updateVersaoDto) {
        const versao = await this.findOne(id);
        if (updateVersaoDto.modeloId) {
            await this.modelosService.findOne(updateVersaoDto.modeloId);
        }
        this.versaoRepository.merge(versao, updateVersaoDto);
        return this.versaoRepository.save(versao);
    }
    async remove(id) {
        const versao = await this.findOne(id);
        await this.versaoRepository.remove(versao);
    }
};
exports.VersoesService = VersoesService;
exports.VersoesService = VersoesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(versao_entity_1.Versao)),
    __param(1, (0, typeorm_1.InjectRepository)(veiculo_entity_1.Veiculo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        modelos_service_1.ModelosService])
], VersoesService);
//# sourceMappingURL=versoes.service.js.map