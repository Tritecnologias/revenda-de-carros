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
exports.ModelosController = void 0;
const common_1 = require("@nestjs/common");
const modelos_service_1 = require("../services/modelos.service");
const modelo_dto_1 = require("../dto/modelo.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let ModelosController = class ModelosController {
    constructor(modelosService) {
        this.modelosService = modelosService;
    }
    async findAll(page = 1, limit = 10) {
        return this.modelosService.findAll(page, limit);
    }
    async findAllActive() {
        try {
            console.log('ModelosController: Buscando todos os modelos ativos');
            const modelos = await this.modelosService.findAllActive();
            console.log(`ModelosController: Encontrados ${modelos.length} modelos ativos`);
            return modelos;
        }
        catch (error) {
            console.error('ModelosController: Erro ao buscar modelos ativos', error);
            throw new common_1.InternalServerErrorException('Erro ao buscar modelos');
        }
    }
    async findAllActivePublic() {
        console.log('ModelosController: Acessando rota pública para buscar todos os modelos ativos');
        const modelos = await this.modelosService.findAllActive();
        console.log(`ModelosController: Retornando ${modelos.length} modelos ativos (público)`);
        return modelos;
    }
    async findByMarca(marcaId) {
        console.log(`ModelosController: Buscando modelos para marca ID: ${marcaId}`);
        return this.modelosService.findByMarca(marcaId);
    }
    async findByMarcaPublic(marcaId) {
        console.log(`ModelosController: Acessando rota pública para buscar modelos da marca ID: ${marcaId}`);
        const result = await this.modelosService.findByMarca(marcaId);
        console.log(`ModelosController: Retornando ${result.length} modelos (público)`);
        return result;
    }
    async findOne(id) {
        return this.modelosService.findOne(id);
    }
    async create(createModeloDto) {
        return this.modelosService.create(createModeloDto);
    }
    async update(id, updateModeloDto) {
        return this.modelosService.update(id, updateModeloDto);
    }
    async remove(id) {
        return this.modelosService.remove(id);
    }
};
exports.ModelosController = ModelosController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ModelosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModelosController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)('public/all'),
    (0, common_1.SetMetadata)('isPublic', true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModelosController.prototype, "findAllActivePublic", null);
__decorate([
    (0, common_1.Get)('by-marca/:marcaId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('marcaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModelosController.prototype, "findByMarca", null);
__decorate([
    (0, common_1.Get)('public/by-marca/:marcaId'),
    (0, common_1.SetMetadata)('isPublic', true),
    __param(0, (0, common_1.Param)('marcaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModelosController.prototype, "findByMarcaPublic", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModelosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [modelo_dto_1.CreateModeloDto]),
    __metadata("design:returntype", Promise)
], ModelosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, modelo_dto_1.UpdateModeloDto]),
    __metadata("design:returntype", Promise)
], ModelosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModelosController.prototype, "remove", null);
exports.ModelosController = ModelosController = __decorate([
    (0, common_1.Controller)('api/veiculos/modelos'),
    __metadata("design:paramtypes", [modelos_service_1.ModelosService])
], ModelosController);
//# sourceMappingURL=modelos.controller.js.map