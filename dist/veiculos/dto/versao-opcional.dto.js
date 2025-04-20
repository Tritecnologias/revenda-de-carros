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
exports.UpdateVersaoOpcionalDto = exports.CreateVersaoOpcionalDto = void 0;
const class_validator_1 = require("class-validator");
class CreateVersaoOpcionalDto {
}
exports.CreateVersaoOpcionalDto = CreateVersaoOpcionalDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID da versão é obrigatório' }),
    (0, class_validator_1.IsNumber)({}, { message: 'O ID da versão deve ser um número' }),
    __metadata("design:type", Number)
], CreateVersaoOpcionalDto.prototype, "versao_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do opcional é obrigatório' }),
    (0, class_validator_1.IsNumber)({}, { message: 'O ID do opcional deve ser um número' }),
    __metadata("design:type", Number)
], CreateVersaoOpcionalDto.prototype, "opcional_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O preço é obrigatório' }),
    (0, class_validator_1.IsNumber)({}, { message: 'O preço deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O preço não pode ser negativo' }),
    __metadata("design:type", Number)
], CreateVersaoOpcionalDto.prototype, "preco", void 0);
class UpdateVersaoOpcionalDto {
}
exports.UpdateVersaoOpcionalDto = UpdateVersaoOpcionalDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'O ID da versão deve ser um número' }),
    __metadata("design:type", Number)
], UpdateVersaoOpcionalDto.prototype, "versao_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'O ID do opcional deve ser um número' }),
    __metadata("design:type", Number)
], UpdateVersaoOpcionalDto.prototype, "opcional_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'O preço deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O preço não pode ser negativo' }),
    __metadata("design:type", Number)
], UpdateVersaoOpcionalDto.prototype, "preco", void 0);
//# sourceMappingURL=versao-opcional.dto.js.map