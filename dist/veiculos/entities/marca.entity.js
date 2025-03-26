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
exports.Marca = void 0;
const typeorm_1 = require("typeorm");
const modelo_entity_1 = require("./modelo.entity");
const veiculo_entity_1 = require("./veiculo.entity");
let Marca = class Marca {
};
exports.Marca = Marca;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Marca.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], Marca.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    }),
    __metadata("design:type", String)
], Marca.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Marca.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Marca.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => modelo_entity_1.Modelo, modelo => modelo.marca),
    __metadata("design:type", Array)
], Marca.prototype, "modelos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => veiculo_entity_1.Veiculo, veiculo => veiculo.marca),
    __metadata("design:type", Array)
], Marca.prototype, "veiculos", void 0);
exports.Marca = Marca = __decorate([
    (0, typeorm_1.Entity)('marca')
], Marca);
//# sourceMappingURL=marca.entity.js.map