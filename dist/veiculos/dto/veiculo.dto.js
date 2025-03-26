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
exports.UpdateVeiculoDto = exports.CreateVeiculoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateVeiculoDto {
}
exports.CreateVeiculoDto = CreateVeiculoDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateVeiculoDto.prototype, "marcaId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateVeiculoDto.prototype, "modeloId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVeiculoDto.prototype, "versao", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateVeiculoDto.prototype, "ano", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVeiculoDto.prototype, "descricao", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVeiculoDto.prototype, "motor", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVeiculoDto.prototype, "combustivel", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['manual', 'automatico', 'cvt', 'automatizado']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVeiculoDto.prototype, "cambio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateVeiculoDto.prototype, "preco", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateVeiculoDto.prototype, "quilometragem", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['novo', 'usado']),
    __metadata("design:type", String)
], CreateVeiculoDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({}, { message: 'A URL da imagem deve ser válida' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVeiculoDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['disponivel', 'reservado', 'vendido']),
    __metadata("design:type", String)
], CreateVeiculoDto.prototype, "situacao", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['ativo', 'inativo']),
    __metadata("design:type", String)
], CreateVeiculoDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateVeiculoDto.prototype, "defisicoicms", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateVeiculoDto.prototype, "defisicoipi", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateVeiculoDto.prototype, "taxicms", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateVeiculoDto.prototype, "taxipi", void 0);
class UpdateVeiculoDto {
}
exports.UpdateVeiculoDto = UpdateVeiculoDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVeiculoDto.prototype, "marcaId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVeiculoDto.prototype, "modeloId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVeiculoDto.prototype, "versao", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVeiculoDto.prototype, "ano", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVeiculoDto.prototype, "descricao", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVeiculoDto.prototype, "motor", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVeiculoDto.prototype, "combustivel", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['manual', 'automatico', 'cvt', 'automatizado']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVeiculoDto.prototype, "cambio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVeiculoDto.prototype, "preco", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVeiculoDto.prototype, "quilometragem", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['novo', 'usado']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVeiculoDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({}, { message: 'A URL da imagem deve ser válida' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVeiculoDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['disponivel', 'reservado', 'vendido']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVeiculoDto.prototype, "situacao", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['ativo', 'inativo']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVeiculoDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVeiculoDto.prototype, "defisicoicms", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVeiculoDto.prototype, "defisicoipi", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVeiculoDto.prototype, "taxicms", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateVeiculoDto.prototype, "taxipi", void 0);
//# sourceMappingURL=veiculo.dto.js.map