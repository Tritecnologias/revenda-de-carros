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
exports.MarcasController = void 0;
const common_1 = require("@nestjs/common");
const marcas_service_1 = require("../services/marcas.service");
const marca_dto_1 = require("../dto/marca.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
let MarcasController = class MarcasController {
    constructor(marcasService) {
        this.marcasService = marcasService;
    }
    async findAll(page = 1, limit = 10) {
        return this.marcasService.findAll(page, limit);
    }
    async findAllActive() {
        console.log('MarcasController: Acessando rota /api/veiculos/marcas/all');
        const result = await this.marcasService.findAllActive();
        console.log(`MarcasController: Retornando ${result.length} marcas`);
        return result;
    }
    async findAllPublic() {
        console.log('MarcasController: Acessando rota pública /api/veiculos/marcas/public');
        try {
            const result = await this.marcasService.findAllActive();
            console.log(`MarcasController: Retornando ${result.length} marcas (público)`);
            return result;
        }
        catch (error) {
            console.error('MarcasController: Erro ao buscar marcas:', error);
            throw error;
        }
    }
    async findOne(id) {
        return this.marcasService.findOne(id);
    }
    async create(createMarcaDto) {
        return this.marcasService.create(createMarcaDto);
    }
    async update(id, updateMarcaDto) {
        return this.marcasService.update(id, updateMarcaDto);
    }
    async remove(id) {
        return this.marcasService.remove(id);
    }
};
exports.MarcasController = MarcasController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MarcasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarcasController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarcasController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MarcasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [marca_dto_1.CreateMarcaDto]),
    __metadata("design:returntype", Promise)
], MarcasController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, marca_dto_1.UpdateMarcaDto]),
    __metadata("design:returntype", Promise)
], MarcasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MarcasController.prototype, "remove", null);
exports.MarcasController = MarcasController = __decorate([
    (0, common_1.Controller)('api/veiculos/marcas'),
    __metadata("design:paramtypes", [marcas_service_1.MarcasService])
], MarcasController);
//# sourceMappingURL=marcas.controller.js.map