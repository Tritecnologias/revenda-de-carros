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
exports.Modelo = void 0;
const typeorm_1 = require("typeorm");
const marca_entity_1 = require("./marca.entity");
const veiculo_entity_1 = require("./veiculo.entity");
const modelo_pintura_entity_1 = require("../../configurador/entities/modelo-pintura.entity");
let Modelo = class Modelo {
};
exports.Modelo = Modelo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Modelo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Modelo.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ativo' }),
    __metadata("design:type", String)
], Modelo.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => marca_entity_1.Marca, marca => marca.modelos),
    (0, typeorm_1.JoinColumn)({ name: 'marcaId' }),
    __metadata("design:type", marca_entity_1.Marca)
], Modelo.prototype, "marca", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Modelo.prototype, "marcaId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Modelo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Modelo.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => veiculo_entity_1.Veiculo, veiculo => veiculo.modelo),
    __metadata("design:type", Array)
], Modelo.prototype, "veiculos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => modelo_pintura_entity_1.ModeloPintura, modeloPintura => modeloPintura.modelo),
    __metadata("design:type", Array)
], Modelo.prototype, "modeloPinturas", void 0);
exports.Modelo = Modelo = __decorate([
    (0, typeorm_1.Entity)('modelo')
], Modelo);
//# sourceMappingURL=modelo.entity.js.map