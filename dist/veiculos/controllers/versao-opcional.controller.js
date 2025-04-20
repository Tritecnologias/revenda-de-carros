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
exports.VersaoOpcionalController = void 0;
const common_1 = require("@nestjs/common");
const versao_opcional_service_1 = require("../services/versao-opcional.service");
const versao_opcional_dto_1 = require("../dto/versao-opcional.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
let VersaoOpcionalController = class VersaoOpcionalController {
    constructor(versaoOpcionalService) {
        this.versaoOpcionalService = versaoOpcionalService;
    }
    async findAllPublic(page = 1, limit = 10, versaoId) {
        console.log(`VersaoOpcionalController: Acessando rota pública para buscar associações. VersaoId: ${versaoId || 'não especificado'}`);
        const result = await this.versaoOpcionalService.findAll(page, limit, versaoId);
        console.log(`VersaoOpcionalController: Retornando ${result.items.length} associações (público)`);
        return result;
    }
    async findByVersaoPublic(id) {
        console.log(`VersaoOpcionalController: Acessando rota pública para buscar opcionais da versão ID: ${id}`);
        const result = await this.versaoOpcionalService.findByVersaoPublic(id);
        console.log(`VersaoOpcionalController: Retornando ${result.length} opcionais para a versão ID: ${id} (público)`);
        return result;
    }
    async findAll(page = 1, limit = 10, versaoId) {
        return this.versaoOpcionalService.findAll(page, limit, versaoId);
    }
    async findOne(id) {
        return this.versaoOpcionalService.findOne(id);
    }
    async findByVersao(id) {
        return this.versaoOpcionalService.findByVersao(id);
    }
    async create(createVersaoOpcionalDto) {
        return this.versaoOpcionalService.create(createVersaoOpcionalDto);
    }
    async update(id, updateVersaoOpcionalDto) {
        return this.versaoOpcionalService.update(id, updateVersaoOpcionalDto);
    }
    async remove(id) {
        return this.versaoOpcionalService.remove(id);
    }
};
exports.VersaoOpcionalController = VersaoOpcionalController;
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('versaoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], VersaoOpcionalController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)('public/versao/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VersaoOpcionalController.prototype, "findByVersaoPublic", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('versaoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], VersaoOpcionalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VersaoOpcionalController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('versao/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VersaoOpcionalController.prototype, "findByVersao", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [versao_opcional_dto_1.CreateVersaoOpcionalDto]),
    __metadata("design:returntype", Promise)
], VersaoOpcionalController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, versao_opcional_dto_1.UpdateVersaoOpcionalDto]),
    __metadata("design:returntype", Promise)
], VersaoOpcionalController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VersaoOpcionalController.prototype, "remove", null);
exports.VersaoOpcionalController = VersaoOpcionalController = __decorate([
    (0, common_1.Controller)('api/veiculos/versao-opcional'),
    __metadata("design:paramtypes", [versao_opcional_service_1.VersaoOpcionalService])
], VersaoOpcionalController);
//# sourceMappingURL=versao-opcional.controller.js.map