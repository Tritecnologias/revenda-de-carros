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
exports.OpcionaisController = void 0;
const common_1 = require("@nestjs/common");
const opcionais_service_1 = require("../services/opcionais.service");
const opcional_dto_1 = require("../dto/opcional.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const path = require("path");
const common_2 = require("@nestjs/common");
let OpcionaisController = class OpcionaisController {
    constructor(opcionaisService) {
        this.opcionaisService = opcionaisService;
    }
    async findAll(res) {
        return res.sendFile(path.join(process.cwd(), 'src/public/veiculos/opcional.html'));
    }
    newOpcional(res) {
        return res.sendFile(path.join(process.cwd(), 'src/public/veiculos/opcional.html'));
    }
    async editOpcional(res) {
        return res.sendFile(path.join(process.cwd(), 'src/public/veiculos/opcional.html'));
    }
    async create(opcionalDto, res) {
        try {
            console.log('OpcionaisController: Criando novo opcional', opcionalDto);
            await this.opcionaisService.create(opcionalDto);
            return res.redirect('/opcionais');
        }
        catch (error) {
            console.error('OpcionaisController: Erro ao criar opcional', error);
            return res.status(500).json({ message: error.message || 'Erro ao criar opcional' });
        }
    }
    async update(id, updateOpcionalDto, res) {
        try {
            console.log(`OpcionaisController: Atualizando opcional ${id}`, updateOpcionalDto);
            await this.opcionaisService.update(+id, updateOpcionalDto);
            return res.redirect('/opcionais');
        }
        catch (error) {
            console.error(`OpcionaisController: Erro ao atualizar opcional ${id}`, error);
            return res.status(500).json({ message: error.message || 'Erro ao atualizar opcional' });
        }
    }
    async remove(id, res) {
        try {
            console.log(`OpcionaisController: Removendo opcional ${id}`);
            await this.opcionaisService.remove(+id);
            return res.redirect('/opcionais');
        }
        catch (error) {
            console.error(`OpcionaisController: Erro ao remover opcional ${id}`, error);
            return res.status(500).json({ message: error.message || 'Erro ao remover opcional' });
        }
    }
    async listOpcionais() {
        console.log('OpcionaisController: Listando todos os opcionais');
        try {
            const opcionais = await this.opcionaisService.findAll();
            console.log(`OpcionaisController: Encontrados ${opcionais.length} opcionais`);
            return opcionais;
        }
        catch (error) {
            console.error('OpcionaisController: Erro ao listar opcionais', error);
            throw new common_2.InternalServerErrorException('Erro ao listar opcionais');
        }
    }
    async getOpcional(id) {
        console.log(`OpcionaisController: Buscando opcional ${id}`);
        try {
            const opcional = await this.opcionaisService.findOne(+id);
            console.log(`OpcionaisController: Opcional ${id} encontrado`, opcional);
            return opcional;
        }
        catch (error) {
            console.error(`OpcionaisController: Erro ao buscar opcional ${id}`, error);
            throw error;
        }
    }
};
exports.OpcionaisController = OpcionaisController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OpcionaisController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('new'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OpcionaisController.prototype, "newOpcional", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/edit'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OpcionaisController.prototype, "editOpcional", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [opcional_dto_1.OpcionalDto, Object]),
    __metadata("design:returntype", Promise)
], OpcionaisController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, opcional_dto_1.UpdateOpcionalDto, Object]),
    __metadata("design:returntype", Promise)
], OpcionaisController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OpcionaisController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('api/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OpcionaisController.prototype, "listOpcionais", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('api/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OpcionaisController.prototype, "getOpcional", null);
exports.OpcionaisController = OpcionaisController = __decorate([
    (0, common_1.Controller)('opcionais'),
    __metadata("design:paramtypes", [opcionais_service_1.OpcionaisService])
], OpcionaisController);
//# sourceMappingURL=opcionais.controller.js.map