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
exports.OpcionaisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const opcional_entity_1 = require("../entities/opcional.entity");
let OpcionaisService = class OpcionaisService {
    constructor(opcionaisRepository) {
        this.opcionaisRepository = opcionaisRepository;
    }
    async findAll() {
        return this.opcionaisRepository.find({
            order: {
                codigo: 'ASC',
            },
        });
    }
    async findOne(id) {
        const opcional = await this.opcionaisRepository.findOne({ where: { id } });
        if (!opcional) {
            throw new common_1.NotFoundException(`Opcional com ID ${id} não encontrado`);
        }
        return opcional;
    }
    async create(opcionalDto) {
        const opcional = this.opcionaisRepository.create(opcionalDto);
        return this.opcionaisRepository.save(opcional);
    }
    async update(id, updateOpcionalDto) {
        const opcional = await this.findOne(id);
        this.opcionaisRepository.merge(opcional, updateOpcionalDto);
        return this.opcionaisRepository.save(opcional);
    }
    async remove(id) {
        const opcional = await this.findOne(id);
        await this.opcionaisRepository.remove(opcional);
    }
};
exports.OpcionaisService = OpcionaisService;
exports.OpcionaisService = OpcionaisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(opcional_entity_1.Opcional)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OpcionaisService);
//# sourceMappingURL=opcionais.service.js.map