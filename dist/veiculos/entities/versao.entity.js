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
exports.Versao = void 0;
const typeorm_1 = require("typeorm");
const modelo_entity_1 = require("./modelo.entity");
const versao_pintura_entity_1 = require("./versao-pintura.entity");
let Versao = class Versao {
};
exports.Versao = Versao;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Versao.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Versao.prototype, "nome_versao", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ativo' }),
    __metadata("design:type", String)
], Versao.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => modelo_entity_1.Modelo),
    (0, typeorm_1.JoinColumn)({ name: 'modeloId' }),
    __metadata("design:type", modelo_entity_1.Modelo)
], Versao.prototype, "modelo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Versao.prototype, "modeloId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Versao.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Versao.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => versao_pintura_entity_1.VersaoPintura, (versaoPintura) => versaoPintura.versao),
    __metadata("design:type", Array)
], Versao.prototype, "versaoPinturas", void 0);
exports.Versao = Versao = __decorate([
    (0, typeorm_1.Entity)('versao')
], Versao);
//# sourceMappingURL=versao.entity.js.map