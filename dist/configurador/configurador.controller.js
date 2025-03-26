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
exports.ConfiguradorController = void 0;
const common_1 = require("@nestjs/common");
const configurador_service_1 = require("./configurador.service");
const create_pintura_dto_1 = require("./dto/create-pintura.dto");
const create_modelo_pintura_dto_1 = require("./dto/create-modelo-pintura.dto");
let ConfiguradorController = class ConfiguradorController {
    constructor(configuradorService) {
        this.configuradorService = configuradorService;
    }
    async getMarcas() {
        return this.configuradorService.getMarcas();
    }
    async getModelos(marca) {
        return this.configuradorService.getModelos(marca);
    }
    async getVersoes(marca, modelo) {
        return this.configuradorService.getVersoes(marca, modelo);
    }
    async getVeiculo(marca, modelo, versao) {
        return this.configuradorService.getVeiculo(marca, modelo, versao);
    }
    async getPinturasParaModelo(modeloId) {
        return this.configuradorService.getPinturasParaModelo(modeloId);
    }
    async getPinturasParaModeloCards(modeloId) {
        return this.configuradorService.getPinturasParaModeloCards(modeloId);
    }
    async calcularPreco(data) {
        return this.configuradorService.calcularPreco(data);
    }
    async getAllPinturas() {
        return this.configuradorService.getAllPinturas();
    }
    async createPintura(createPinturaDto) {
        return this.configuradorService.createPintura(createPinturaDto);
    }
    async getPinturaById(id) {
        return this.configuradorService.getPinturaById(id);
    }
    async updatePintura(id, updatePinturaDto) {
        return this.configuradorService.updatePintura(id, updatePinturaDto);
    }
    async deletePintura(id) {
        return this.configuradorService.deletePintura(id);
    }
    async createModeloPintura(createModeloPinturaDto) {
        return this.configuradorService.createModeloPintura(createModeloPinturaDto);
    }
    async getModeloPinturaById(id) {
        return this.configuradorService.getModeloPinturaById(id);
    }
    async updateModeloPintura(id, updateModeloPinturaDto) {
        return this.configuradorService.updateModeloPintura(id, updateModeloPinturaDto);
    }
    async deleteModeloPintura(id) {
        return this.configuradorService.deleteModeloPintura(id);
    }
};
exports.ConfiguradorController = ConfiguradorController;
__decorate([
    (0, common_1.Get)('marcas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "getMarcas", null);
__decorate([
    (0, common_1.Get)('modelos/:marca'),
    __param(0, (0, common_1.Param)('marca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "getModelos", null);
__decorate([
    (0, common_1.Get)('versoes/:marca/:modelo'),
    __param(0, (0, common_1.Param)('marca')),
    __param(1, (0, common_1.Param)('modelo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "getVersoes", null);
__decorate([
    (0, common_1.Get)('veiculo/:marca/:modelo/:versao'),
    __param(0, (0, common_1.Param)('marca')),
    __param(1, (0, common_1.Param)('modelo')),
    __param(2, (0, common_1.Param)('versao')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "getVeiculo", null);
__decorate([
    (0, common_1.Get)('pinturas/modelo/:modeloId'),
    __param(0, (0, common_1.Param)('modeloId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "getPinturasParaModelo", null);
__decorate([
    (0, common_1.Get)('pinturas/modelo/:modeloId/cards'),
    __param(0, (0, common_1.Param)('modeloId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "getPinturasParaModeloCards", null);
__decorate([
    (0, common_1.Post)('calcular-preco'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "calcularPreco", null);
__decorate([
    (0, common_1.Get)('pinturas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "getAllPinturas", null);
__decorate([
    (0, common_1.Post)('pinturas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pintura_dto_1.CreatePinturaDto]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "createPintura", null);
__decorate([
    (0, common_1.Get)('pinturas/detalhe/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "getPinturaById", null);
__decorate([
    (0, common_1.Put)('pinturas/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_pintura_dto_1.CreatePinturaDto]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "updatePintura", null);
__decorate([
    (0, common_1.Delete)('pinturas/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "deletePintura", null);
__decorate([
    (0, common_1.Post)('modelo-pintura'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_modelo_pintura_dto_1.CreateModeloPinturaDto]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "createModeloPintura", null);
__decorate([
    (0, common_1.Get)('modelo-pintura/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "getModeloPinturaById", null);
__decorate([
    (0, common_1.Put)('modelo-pintura/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_modelo_pintura_dto_1.CreateModeloPinturaDto]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "updateModeloPintura", null);
__decorate([
    (0, common_1.Delete)('modelo-pintura/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfiguradorController.prototype, "deleteModeloPintura", null);
exports.ConfiguradorController = ConfiguradorController = __decorate([
    (0, common_1.Controller)('configurador'),
    __metadata("design:paramtypes", [configurador_service_1.ConfiguradorService])
], ConfiguradorController);
//# sourceMappingURL=configurador.controller.js.map