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
exports.ModeloOpcionalController = void 0;
const common_1 = require("@nestjs/common");
const modelo_opcional_service_1 = require("../services/modelo-opcional.service");
const modelo_opcional_dto_1 = require("../dto/modelo-opcional.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const common_2 = require("@nestjs/common");
let ModeloOpcionalController = class ModeloOpcionalController {
    constructor(modeloOpcionalService) {
        this.modeloOpcionalService = modeloOpcionalService;
    }
    async findAll() {
        try {
            console.log('ModeloOpcionalController: Listando todas as associações');
            const result = await this.modeloOpcionalService.findAll();
            console.log(`ModeloOpcionalController: Encontradas ${result.length} associações`);
            return result;
        }
        catch (error) {
            console.error('ModeloOpcionalController: Erro ao listar associações', error);
            throw new common_2.InternalServerErrorException('Erro ao buscar associações');
        }
    }
    async findByModeloId(modeloId) {
        try {
            console.log(`ModeloOpcionalController: Buscando opcionais para o modelo ID: ${modeloId}`);
            const result = await this.modeloOpcionalService.findByModeloId(+modeloId);
            console.log(`ModeloOpcionalController: Encontrados ${result.length} opcionais para o modelo ID: ${modeloId}`);
            return result;
        }
        catch (error) {
            console.error(`ModeloOpcionalController: Erro ao buscar opcionais para o modelo ID: ${modeloId}`, error);
            throw new common_2.InternalServerErrorException('Erro ao buscar opcionais para o modelo');
        }
    }
    async findByModeloPublic(modeloId) {
        try {
            console.log(`Buscando opcionais para o modelo ID: ${modeloId}`);
            const modeloOpcionais = await this.modeloOpcionalService.findByModeloId(modeloId);
            const opcionaisFormatados = modeloOpcionais.map(mo => ({
                id: mo.id,
                codigo: mo.opcional.codigo,
                descricao: mo.opcional.descricao,
                preco: mo.preco,
                opcionalId: mo.opcionalId,
                modeloId: mo.modeloId
            }));
            console.log(`Encontrados ${opcionaisFormatados.length} opcionais para o modelo ID: ${modeloId}`);
            return opcionaisFormatados;
        }
        catch (error) {
            console.error(`Erro ao buscar opcionais para o modelo ID: ${modeloId}`, error);
            throw new common_2.InternalServerErrorException('Erro ao buscar opcionais para o modelo');
        }
    }
    async findOne(id) {
        return this.modeloOpcionalService.findOne(+id);
    }
    async create(modeloOpcionalDto) {
        return this.modeloOpcionalService.create(modeloOpcionalDto);
    }
    async update(id, updateModeloOpcionalDto) {
        return this.modeloOpcionalService.update(+id, updateModeloOpcionalDto);
    }
    async remove(id) {
        await this.modeloOpcionalService.remove(+id);
        return { success: true };
    }
};
exports.ModeloOpcionalController = ModeloOpcionalController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModeloOpcionalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-modelo/:modeloId'),
    __param(0, (0, common_1.Param)('modeloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModeloOpcionalController.prototype, "findByModeloId", null);
__decorate([
    (0, common_1.Get)('by-modelo/:modeloId/public'),
    __param(0, (0, common_1.Param)('modeloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModeloOpcionalController.prototype, "findByModeloPublic", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModeloOpcionalController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [modelo_opcional_dto_1.ModeloOpcionalDto]),
    __metadata("design:returntype", Promise)
], ModeloOpcionalController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, modelo_opcional_dto_1.UpdateModeloOpcionalDto]),
    __metadata("design:returntype", Promise)
], ModeloOpcionalController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModeloOpcionalController.prototype, "remove", null);
exports.ModeloOpcionalController = ModeloOpcionalController = __decorate([
    (0, common_1.Controller)('api/modelo-opcional'),
    __metadata("design:paramtypes", [modelo_opcional_service_1.ModeloOpcionalService])
], ModeloOpcionalController);
//# sourceMappingURL=modelo-opcional.controller.js.map