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
var VersoesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersoesController = void 0;
const common_1 = require("@nestjs/common");
const versoes_service_1 = require("../services/versoes.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const common_2 = require("@nestjs/common");
let VersoesController = VersoesController_1 = class VersoesController {
    constructor(versoesService) {
        this.versoesService = versoesService;
        this.logger = new common_2.Logger(VersoesController_1.name);
        this.logger.log('VersoesController inicializado');
        this.logger.log('Rotas disponíveis:');
        this.logger.log('GET /api/versoes/raw');
        this.logger.log('GET /api/versoes/raw/modelo/:modeloId');
        this.logger.log('GET /api/versoes/public');
        this.logger.log('GET /api/versoes/all');
        this.logger.log('GET /api/versoes/modelo/:modeloId');
        this.logger.log('GET /api/versoes/modelo/:modeloId/public');
        this.logger.log('GET /api/versoes/:id');
        this.logger.log('GET /api/versoes/:id/public');
        this.logger.log('POST /api/versoes');
        this.logger.log('PATCH /api/versoes/:id');
        this.logger.log('DELETE /api/versoes/:id');
    }
    async create(createVersaoDto) {
        try {
            console.log('VersoesController: Criando nova versão', createVersaoDto);
            return await this.versoesService.create(createVersaoDto);
        }
        catch (error) {
            console.error('VersoesController: Erro ao criar versão:', error.message);
            throw new common_1.HttpException(error.message || 'Erro ao criar versão', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        try {
            console.log('VersoesController: Buscando todas as versões');
            return await this.versoesService.findAll();
        }
        catch (error) {
            console.error('VersoesController: Erro ao buscar versões:', error.message);
            throw new common_1.HttpException(error.message || 'Erro ao buscar versões', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllPublic() {
        try {
            console.log('VersoesController: Buscando todas as versões (público)');
            return await this.versoesService.findAll();
        }
        catch (error) {
            console.error('VersoesController: Erro ao buscar versões (público):', error.message);
            throw new common_1.HttpException(error.message || 'Erro ao buscar versões', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllAlternative() {
        try {
            console.log('VersoesController: Buscando todas as versões (endpoint alternativo)');
            return await this.versoesService.findAll();
        }
        catch (error) {
            console.error('VersoesController: Erro ao buscar versões (endpoint alternativo):', error.message);
            throw new common_1.HttpException(error.message || 'Erro ao buscar versões', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllRaw() {
        try {
            console.log('VersoesController: Buscando todas as versões com SQL direto (público)');
            const versoes = await this.versoesService.findAllRaw();
            return versoes;
        }
        catch (error) {
            console.error('VersoesController: Erro ao buscar versões com SQL direto (público):', error.message);
            throw new common_1.HttpException(error.message || 'Erro ao buscar versões', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByModeloRaw(modeloId) {
        try {
            console.log(`VersoesController: Buscando versões para o modelo ${modeloId} com SQL direto (público)`);
            const versoes = await this.versoesService.findByModeloRaw(+modeloId);
            return versoes;
        }
        catch (error) {
            console.error(`VersoesController: Erro ao buscar versões para o modelo ${modeloId} com SQL direto (público):`, error.message);
            throw new common_1.HttpException(error.message || `Erro ao buscar versões para o modelo ${modeloId}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByModelo(modeloId) {
        try {
            console.log(`VersoesController: Buscando versões para o modelo ${modeloId}`);
            return await this.versoesService.findByModelo(+modeloId);
        }
        catch (error) {
            console.error(`VersoesController: Erro ao buscar versões para o modelo ${modeloId}:`, error.message);
            throw new common_1.HttpException(error.message || `Erro ao buscar versões para o modelo ${modeloId}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByModeloPublic(modeloId) {
        try {
            console.log(`VersoesController: Buscando versões para o modelo ${modeloId} (público)`);
            return await this.versoesService.findByModelo(+modeloId);
        }
        catch (error) {
            console.error(`VersoesController: Erro ao buscar versões para o modelo ${modeloId} (público):`, error.message);
            throw new common_1.HttpException(error.message || `Erro ao buscar versões para o modelo ${modeloId}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            console.log(`VersoesController: Buscando versão ${id}`);
            return await this.versoesService.findOne(+id);
        }
        catch (error) {
            console.error(`VersoesController: Erro ao buscar versão ${id}:`, error.message);
            throw new common_1.HttpException(error.message || `Erro ao buscar versão com ID ${id}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOnePublic(id) {
        try {
            console.log(`VersoesController: Buscando versão ${id} (público)`);
            return await this.versoesService.findOne(+id);
        }
        catch (error) {
            console.error(`VersoesController: Erro ao buscar versão ${id} (público):`, error.message);
            throw new common_1.HttpException(error.message || `Erro ao buscar versão com ID ${id}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateVersaoDto) {
        try {
            console.log(`VersoesController: Atualizando versão ${id}`, updateVersaoDto);
            return await this.versoesService.update(+id, updateVersaoDto);
        }
        catch (error) {
            console.error(`VersoesController: Erro ao atualizar versão ${id}:`, error.message);
            throw new common_1.HttpException(error.message || `Erro ao atualizar versão com ID ${id}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            console.log(`VersoesController: Removendo versão ${id}`);
            return await this.versoesService.remove(+id);
        }
        catch (error) {
            console.error(`VersoesController: Erro ao remover versão ${id}:`, error.message);
            throw new common_1.HttpException(error.message || `Erro ao remover versão com ID ${id}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.VersoesController = VersoesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [versoes_service_1.CreateVersaoDto]),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, common_1.SetMetadata)('isPublic', true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.SetMetadata)('isPublic', true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "findAllAlternative", null);
__decorate([
    (0, common_1.Get)('raw'),
    (0, common_1.SetMetadata)('isPublic', true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "findAllRaw", null);
__decorate([
    (0, common_1.Get)('raw/modelo/:modeloId'),
    (0, common_1.SetMetadata)('isPublic', true),
    __param(0, (0, common_1.Param)('modeloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "findByModeloRaw", null);
__decorate([
    (0, common_1.Get)('modelo/:modeloId'),
    __param(0, (0, common_1.Param)('modeloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "findByModelo", null);
__decorate([
    (0, common_1.Get)('modelo/:modeloId/public'),
    (0, common_1.SetMetadata)('isPublic', true),
    __param(0, (0, common_1.Param)('modeloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "findByModeloPublic", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/public'),
    (0, common_1.SetMetadata)('isPublic', true),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "findOnePublic", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, versoes_service_1.UpdateVersaoDto]),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VersoesController.prototype, "remove", null);
exports.VersoesController = VersoesController = VersoesController_1 = __decorate([
    (0, common_1.Controller)('api/versoes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [versoes_service_1.VersoesService])
], VersoesController);
//# sourceMappingURL=versoes.controller.js.map