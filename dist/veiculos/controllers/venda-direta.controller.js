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
exports.VendaDiretaController = void 0;
const common_1 = require("@nestjs/common");
const venda_direta_service_1 = require("../services/venda-direta.service");
const venda_direta_dto_1 = require("../dto/venda-direta.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let VendaDiretaController = class VendaDiretaController {
    constructor(vendaDiretaService) {
        this.vendaDiretaService = vendaDiretaService;
    }
    async findAllPublic(page = 1, limit = 10, marcaId) {
        console.log(`VendaDiretaController: Acessando rota pública para buscar vendas diretas. MarcaId: ${marcaId || 'não especificado'}`);
        const result = await this.vendaDiretaService.findAll(page, limit, marcaId);
        console.log(`VendaDiretaController: Retornando ${result.items.length} vendas diretas (público)`);
        return result;
    }
    async findOnePublic(id) {
        console.log(`VendaDiretaController: Acessando rota pública para buscar venda direta ID: ${id}`);
        const result = await this.vendaDiretaService.findOne(id);
        console.log(`VendaDiretaController: Retornando venda direta ID: ${id} (público)`);
        return result;
    }
    async findAll(page = 1, limit = 10, marcaId) {
        return this.vendaDiretaService.findAll(page, limit, marcaId);
    }
    async findOne(id) {
        return this.vendaDiretaService.findOne(id);
    }
    async create(createVendaDiretaDto) {
        return this.vendaDiretaService.create(createVendaDiretaDto);
    }
    async update(id, updateVendaDiretaDto) {
        return this.vendaDiretaService.update(id, updateVendaDiretaDto);
    }
    async remove(id) {
        return this.vendaDiretaService.remove(id);
    }
};
exports.VendaDiretaController = VendaDiretaController;
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('marcaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], VendaDiretaController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)('public/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VendaDiretaController.prototype, "findOnePublic", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('marcaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], VendaDiretaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VendaDiretaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [venda_direta_dto_1.CreateVendaDiretaDto]),
    __metadata("design:returntype", Promise)
], VendaDiretaController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, venda_direta_dto_1.UpdateVendaDiretaDto]),
    __metadata("design:returntype", Promise)
], VendaDiretaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VendaDiretaController.prototype, "remove", null);
exports.VendaDiretaController = VendaDiretaController = __decorate([
    (0, common_1.Controller)('api/venda-direta'),
    __metadata("design:paramtypes", [venda_direta_service_1.VendaDiretaService])
], VendaDiretaController);
//# sourceMappingURL=venda-direta.controller.js.map