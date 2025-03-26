"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguradorModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const configurador_controller_1 = require("./configurador.controller");
const configurador_service_1 = require("./configurador.service");
const veiculo_entity_1 = require("./entities/veiculo.entity");
const pintura_entity_1 = require("./entities/pintura.entity");
const modelo_pintura_entity_1 = require("./entities/modelo-pintura.entity");
const modelo_entity_1 = require("../veiculos/entities/modelo.entity");
let ConfiguradorModule = class ConfiguradorModule {
};
exports.ConfiguradorModule = ConfiguradorModule;
exports.ConfiguradorModule = ConfiguradorModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([veiculo_entity_1.Veiculo, pintura_entity_1.Pintura, modelo_pintura_entity_1.ModeloPintura, modelo_entity_1.Modelo])],
        controllers: [configurador_controller_1.ConfiguradorController],
        providers: [configurador_service_1.ConfiguradorService],
    })
], ConfiguradorModule);
//# sourceMappingURL=configurador.module.js.map