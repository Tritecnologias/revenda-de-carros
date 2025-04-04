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
exports.UpdateOpcionalDto = exports.OpcionalDto = void 0;
const class_validator_1 = require("class-validator");
class OpcionalDto {
}
exports.OpcionalDto = OpcionalDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O código é obrigatório' }),
    (0, class_validator_1.IsString)({ message: 'O código deve ser uma string' }),
    __metadata("design:type", String)
], OpcionalDto.prototype, "codigo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'A descrição é obrigatória' }),
    (0, class_validator_1.IsString)({ message: 'A descrição deve ser uma string' }),
    __metadata("design:type", String)
], OpcionalDto.prototype, "descricao", void 0);
class UpdateOpcionalDto extends OpcionalDto {
}
exports.UpdateOpcionalDto = UpdateOpcionalDto;
//# sourceMappingURL=opcional.dto.js.map