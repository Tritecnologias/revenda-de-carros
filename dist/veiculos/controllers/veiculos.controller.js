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
exports.VeiculosController = void 0;
const common_1 = require("@nestjs/common");
const veiculos_service_1 = require("../services/veiculos.service");
const veiculo_dto_1 = require("../dto/veiculo.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let VeiculosController = class VeiculosController {
    constructor(veiculosService) {
        this.veiculosService = veiculosService;
    }
    async findAllPublic(page = 1, limit = 10, modeloId) {
        console.log(`VeiculosController: Acessando rota pública para buscar veículos. ModeloId: ${modeloId || 'não especificado'}`);
        const result = await this.veiculosService.findAll(page, limit, modeloId);
        console.log(`VeiculosController: Retornando ${result.items.length} veículos (público)`);
        return result;
    }
    async findOnePublic(id) {
        console.log(`VeiculosController: Acessando rota pública para buscar veículo ID: ${id}`);
        const result = await this.veiculosService.findOne(id);
        console.log(`VeiculosController: Retornando veículo ID: ${id} (público)`);
        return result;
    }
    async findAll(page = 1, limit = 10, modeloId) {
        return this.veiculosService.findAll(page, limit, modeloId);
    }
    async findOne(id) {
        return this.veiculosService.findOne(id);
    }
    async create(createVeiculoDto) {
        return this.veiculosService.create(createVeiculoDto);
    }
    async update(id, updateVeiculoDto) {
        return this.veiculosService.update(id, updateVeiculoDto);
    }
    async remove(id) {
        return this.veiculosService.remove(id);
    }
};
exports.VeiculosController = VeiculosController;
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('modeloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], VeiculosController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)('public/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VeiculosController.prototype, "findOnePublic", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('modeloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], VeiculosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VeiculosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [veiculo_dto_1.CreateVeiculoDto]),
    __metadata("design:returntype", Promise)
], VeiculosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, veiculo_dto_1.UpdateVeiculoDto]),
    __metadata("design:returntype", Promise)
], VeiculosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VeiculosController.prototype, "remove", null);
exports.VeiculosController = VeiculosController = __decorate([
    (0, common_1.Controller)('api/veiculos'),
    __metadata("design:paramtypes", [veiculos_service_1.VeiculosService])
], VeiculosController);
//# sourceMappingURL=veiculos.controller.js.map