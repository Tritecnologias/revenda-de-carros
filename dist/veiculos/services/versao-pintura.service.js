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
exports.VersaoPinturaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const versao_pintura_entity_1 = require("../entities/versao-pintura.entity");
let VersaoPinturaService = class VersaoPinturaService {
    constructor(versaoPinturaRepository) {
        this.versaoPinturaRepository = versaoPinturaRepository;
    }
    findAll() {
        return this.versaoPinturaRepository.find({
            relations: ['versao', 'versao.modelo', 'pintura']
        });
    }
    findOne(id) {
        return this.versaoPinturaRepository.findOne({ where: { id } });
    }
    create(data) {
        const entity = this.versaoPinturaRepository.create(data);
        return this.versaoPinturaRepository.save(entity);
    }
    update(id, data) {
        return this.versaoPinturaRepository.update(id, data);
    }
    remove(id) {
        return this.versaoPinturaRepository.delete(id);
    }
    async findByVersaoId(versaoId) {
        const versaoPinturas = await this.versaoPinturaRepository.find({
            where: { versao: { id: versaoId } },
            relations: ['versao', 'pintura']
        });
        return versaoPinturas.map(vp => ({
            id: vp.pintura.id,
            nome: vp.pintura.nome,
            tipo: vp.pintura.tipo,
            preco: vp.preco,
            imageUrl: vp.imageUrl
        }));
    }
};
exports.VersaoPinturaService = VersaoPinturaService;
exports.VersaoPinturaService = VersaoPinturaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(versao_pintura_entity_1.VersaoPintura)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VersaoPinturaService);
//# sourceMappingURL=versao-pintura.service.js.map