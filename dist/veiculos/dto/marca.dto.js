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
exports.UpdateMarcaDto = exports.CreateMarcaDto = void 0;
const class_validator_1 = require("class-validator");
class CreateMarcaDto {
    constructor() {
        this.status = 'ativo';
    }
}
exports.CreateMarcaDto = CreateMarcaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMarcaDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['ativo', 'inativo']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarcaDto.prototype, "status", void 0);
class UpdateMarcaDto {
}
exports.UpdateMarcaDto = UpdateMarcaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarcaDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['ativo', 'inativo']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarcaDto.prototype, "status", void 0);
//# sourceMappingURL=marca.dto.js.map