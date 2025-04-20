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
exports.VersaoOpcional = void 0;
const typeorm_1 = require("typeorm");
const versao_entity_1 = require("./versao.entity");
const opcional_entity_1 = require("./opcional.entity");
let VersaoOpcional = class VersaoOpcional {
};
exports.VersaoOpcional = VersaoOpcional;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VersaoOpcional.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VersaoOpcional.prototype, "versao_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VersaoOpcional.prototype, "opcional_id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], VersaoOpcional.prototype, "preco", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => versao_entity_1.Versao, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'versao_id' }),
    __metadata("design:type", versao_entity_1.Versao)
], VersaoOpcional.prototype, "versao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => opcional_entity_1.Opcional, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'opcional_id' }),
    __metadata("design:type", opcional_entity_1.Opcional)
], VersaoOpcional.prototype, "opcional", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], VersaoOpcional.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], VersaoOpcional.prototype, "updated_at", void 0);
exports.VersaoOpcional = VersaoOpcional = __decorate([
    (0, typeorm_1.Entity)('versao_opcional')
], VersaoOpcional);
//# sourceMappingURL=versao-opcional.entity.js.map