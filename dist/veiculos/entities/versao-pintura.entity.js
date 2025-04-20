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
exports.VersaoPintura = void 0;
const typeorm_1 = require("typeorm");
const versao_entity_1 = require("./versao.entity");
const pintura_entity_1 = require("../../configurador/entities/pintura.entity");
let VersaoPintura = class VersaoPintura {
};
exports.VersaoPintura = VersaoPintura;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VersaoPintura.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => versao_entity_1.Versao, versao => versao.versaoPinturas, { eager: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'versaoId' }),
    __metadata("design:type", versao_entity_1.Versao)
], VersaoPintura.prototype, "versao", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VersaoPintura.prototype, "versaoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pintura_entity_1.Pintura, { eager: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pinturaId' }),
    __metadata("design:type", pintura_entity_1.Pintura)
], VersaoPintura.prototype, "pintura", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VersaoPintura.prototype, "pinturaId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], VersaoPintura.prototype, "preco", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], VersaoPintura.prototype, "imageUrl", void 0);
exports.VersaoPintura = VersaoPintura = __decorate([
    (0, typeorm_1.Entity)()
], VersaoPintura);
//# sourceMappingURL=versao-pintura.entity.js.map