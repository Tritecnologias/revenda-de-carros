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
exports.VersoesPublicController = void 0;
const common_1 = require("@nestjs/common");
const versoes_service_1 = require("../services/versoes.service");
let VersoesPublicController = class VersoesPublicController {
    constructor(versoesService) {
        this.versoesService = versoesService;
    }
    async findAll() {
        try {
            console.log('VersoesPublicController: Buscando todas as versões (público)');
            return await this.versoesService.findAll();
        }
        catch (error) {
            console.error('VersoesPublicController: Erro ao buscar versões (público):', error.message);
            throw new common_1.HttpException(error.message || 'Erro ao buscar versões', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllAlternative() {
        try {
            console.log('VersoesPublicController: Buscando todas as versões (endpoint alternativo)');
            return await this.versoesService.findAll();
        }
        catch (error) {
            console.error('VersoesPublicController: Erro ao buscar versões (endpoint alternativo):', error.message);
            throw new common_1.HttpException(error.message || 'Erro ao buscar versões', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByModelo(modeloId) {
        try {
            console.log(`VersoesPublicController: Buscando versões para o modelo ${modeloId}`);
            return await this.versoesService.findByModelo(+modeloId);
        }
        catch (error) {
            console.error(`VersoesPublicController: Erro ao buscar versões para o modelo ${modeloId}:`, error.message);
            throw new common_1.HttpException(error.message || `Erro ao buscar versões para o modelo ${modeloId}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            console.log(`VersoesPublicController: Buscando versão ${id}`);
            return await this.versoesService.findOne(+id);
        }
        catch (error) {
            console.error(`VersoesPublicController: Erro ao buscar versão ${id}:`, error.message);
            throw new common_1.HttpException(error.message || `Erro ao buscar versão ${id}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.VersoesPublicController = VersoesPublicController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VersoesPublicController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VersoesPublicController.prototype, "findAllAlternative", null);
__decorate([
    (0, common_1.Get)('modelo/:modeloId'),
    __param(0, (0, common_1.Param)('modeloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VersoesPublicController.prototype, "findByModelo", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VersoesPublicController.prototype, "findOne", null);
exports.VersoesPublicController = VersoesPublicController = __decorate([
    (0, common_1.Controller)('api/veiculos/versoes'),
    __metadata("design:paramtypes", [versoes_service_1.VersoesService])
], VersoesPublicController);
//# sourceMappingURL=versoes-public.controller.js.map