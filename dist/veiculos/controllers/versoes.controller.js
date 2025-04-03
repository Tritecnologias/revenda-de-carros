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
exports.VersoesController = void 0;
const common_1 = require("@nestjs/common");
const versoes_service_1 = require("../services/versoes.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
let VersoesController = class VersoesController {
    constructor(versoesService) {
        this.versoesService = versoesService;
    }
    create(createVersaoDto) {
        console.log('VersoesController: Criando nova versão', createVersaoDto);
        return this.versoesService.create(createVersaoDto);
    }
    findAll() {
        console.log('VersoesController: Buscando todas as versões');
        return this.versoesService.findAll();
    }
    findAllPublic() {
        console.log('VersoesController: Buscando todas as versões (público)');
        return this.versoesService.findAll();
    }
    findByModelo(modeloId) {
        console.log(`VersoesController: Buscando versões para o modelo ${modeloId}`);
        return this.versoesService.findByModelo(+modeloId);
    }
    findByModeloPublic(modeloId) {
        console.log(`VersoesController: Buscando versões para o modelo ${modeloId} (público)`);
        return this.versoesService.findByModelo(+modeloId);
    }
    findOne(id) {
        console.log(`VersoesController: Buscando versão ${id}`);
        return this.versoesService.findOne(+id);
    }
    findOnePublic(id) {
        console.log(`VersoesController: Buscando versão ${id} (público)`);
        return this.versoesService.findOne(+id);
    }
    update(id, updateVersaoDto) {
        console.log(`VersoesController: Atualizando versão ${id}`, updateVersaoDto);
        return this.versoesService.update(+id, updateVersaoDto);
    }
    remove(id) {
        console.log(`VersoesController: Removendo versão ${id}`);
        return this.versoesService.remove(+id);
    }
};
exports.VersoesController = VersoesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [versoes_service_1.CreateVersaoDto]),
    __metadata("design:returntype", void 0)
], VersoesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VersoesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, common_1.SetMetadata)('isPublic', true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VersoesController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)('modelo/:modeloId'),
    __param(0, (0, common_1.Param)('modeloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VersoesController.prototype, "findByModelo", null);
__decorate([
    (0, common_1.Get)('modelo/:modeloId/public'),
    (0, common_1.SetMetadata)('isPublic', true),
    __param(0, (0, common_1.Param)('modeloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VersoesController.prototype, "findByModeloPublic", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VersoesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/public'),
    (0, common_1.SetMetadata)('isPublic', true),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VersoesController.prototype, "findOnePublic", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'cadastrador'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, versoes_service_1.UpdateVersaoDto]),
    __metadata("design:returntype", void 0)
], VersoesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VersoesController.prototype, "remove", null);
exports.VersoesController = VersoesController = __decorate([
    (0, common_1.Controller)('api/versoes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [versoes_service_1.VersoesService])
], VersoesController);
//# sourceMappingURL=versoes.controller.js.map