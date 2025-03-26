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
exports.ModeloOpcional = void 0;
const typeorm_1 = require("typeorm");
const modelo_entity_1 = require("./modelo.entity");
const opcional_entity_1 = require("./opcional.entity");
let ModeloOpcional = class ModeloOpcional {
};
exports.ModeloOpcional = ModeloOpcional;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ModeloOpcional.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => modelo_entity_1.Modelo, modelo => modelo.id),
    (0, typeorm_1.JoinColumn)({ name: 'modeloId' }),
    __metadata("design:type", modelo_entity_1.Modelo)
], ModeloOpcional.prototype, "modelo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ModeloOpcional.prototype, "modeloId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => opcional_entity_1.Opcional, opcional => opcional.id),
    (0, typeorm_1.JoinColumn)({ name: 'opcionalId' }),
    __metadata("design:type", opcional_entity_1.Opcional)
], ModeloOpcional.prototype, "opcional", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ModeloOpcional.prototype, "opcionalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ModeloOpcional.prototype, "preco", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ModeloOpcional.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ModeloOpcional.prototype, "updatedAt", void 0);
exports.ModeloOpcional = ModeloOpcional = __decorate([
    (0, typeorm_1.Entity)('modelo_opcional')
], ModeloOpcional);
//# sourceMappingURL=modelo-opcional.entity.js.map