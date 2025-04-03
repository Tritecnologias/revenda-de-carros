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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Veiculo = void 0;
const typeorm_1 = require("typeorm");
const marca_entity_1 = require("./marca.entity");
const modelo_entity_1 = require("./modelo.entity");
const versao_entity_1 = require("./versao.entity");
let Veiculo = class Veiculo {
};
exports.Veiculo = Veiculo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => marca_entity_1.Marca, marca => marca.veiculos),
    (0, typeorm_1.JoinColumn)({ name: 'marcaId' }),
    __metadata("design:type", marca_entity_1.Marca)
], Veiculo.prototype, "marca", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Veiculo.prototype, "marcaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => modelo_entity_1.Modelo, modelo => modelo.veiculos),
    (0, typeorm_1.JoinColumn)({ name: 'modeloId' }),
    __metadata("design:type", modelo_entity_1.Modelo)
], Veiculo.prototype, "modelo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Veiculo.prototype, "modeloId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => versao_entity_1.Versao),
    (0, typeorm_1.JoinColumn)({ name: 'versaoId' }),
    __metadata("design:type", versao_entity_1.Versao)
], Veiculo.prototype, "versao", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Veiculo.prototype, "versaoId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Veiculo.prototype, "ano", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Veiculo.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Veiculo.prototype, "motor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Veiculo.prototype, "combustivel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Veiculo.prototype, "cambio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Veiculo.prototype, "preco", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Veiculo.prototype, "quilometragem", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'novo' }),
    __metadata("design:type", String)
], Veiculo.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'disponivel' }),
    __metadata("design:type", String)
], Veiculo.prototype, "situacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ativo' }),
    __metadata("design:type", String)
], Veiculo.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Veiculo.prototype, "defisicoicms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Veiculo.prototype, "defisicoipi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Veiculo.prototype, "taxicms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Veiculo.prototype, "taxipi", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Veiculo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Veiculo.prototype, "updatedAt", void 0);
exports.Veiculo = Veiculo = __decorate([
    (0, typeorm_1.Entity)('veiculos')
], Veiculo);
//# sourceMappingURL=veiculo.entity.js.map