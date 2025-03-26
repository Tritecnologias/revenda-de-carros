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
exports.ModeloPintura = void 0;
const typeorm_1 = require("typeorm");
const modelo_entity_1 = require("../../veiculos/entities/modelo.entity");
const pintura_entity_1 = require("./pintura.entity");
let ModeloPintura = class ModeloPintura {
};
exports.ModeloPintura = ModeloPintura;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ModeloPintura.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => modelo_entity_1.Modelo, modelo => modelo.modeloPinturas),
    (0, typeorm_1.JoinColumn)({ name: 'modeloId' }),
    __metadata("design:type", modelo_entity_1.Modelo)
], ModeloPintura.prototype, "modelo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ModeloPintura.prototype, "modeloId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pintura_entity_1.Pintura, pintura => pintura.modeloPinturas),
    (0, typeorm_1.JoinColumn)({ name: 'pinturaId' }),
    __metadata("design:type", pintura_entity_1.Pintura)
], ModeloPintura.prototype, "pintura", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ModeloPintura.prototype, "pinturaId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ModeloPintura.prototype, "preco", void 0);
exports.ModeloPintura = ModeloPintura = __decorate([
    (0, typeorm_1.Entity)('modelo_pintura')
], ModeloPintura);
//# sourceMappingURL=modelo-pintura.entity.js.map