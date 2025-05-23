"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeiculosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const marca_entity_1 = require("./entities/marca.entity");
const modelo_entity_1 = require("./entities/modelo.entity");
const veiculo_entity_1 = require("./entities/veiculo.entity");
const opcional_entity_1 = require("./entities/opcional.entity");
const modelo_opcional_entity_1 = require("./entities/modelo-opcional.entity");
const venda_direta_entity_1 = require("./entities/venda-direta.entity");
const versao_entity_1 = require("./entities/versao.entity");
const versao_opcional_entity_1 = require("./entities/versao-opcional.entity");
const versao_pintura_entity_1 = require("./entities/versao-pintura.entity");
const marcas_controller_1 = require("./controllers/marcas.controller");
const modelos_controller_1 = require("./controllers/modelos.controller");
const veiculos_controller_1 = require("./controllers/veiculos.controller");
const opcionais_controller_1 = require("./controllers/opcionais.controller");
const modelo_opcional_controller_1 = require("./controllers/modelo-opcional.controller");
const venda_direta_controller_1 = require("./controllers/venda-direta.controller");
const versoes_controller_1 = require("./controllers/versoes.controller");
const versoes_public_controller_1 = require("./controllers/versoes-public.controller");
const versao_opcional_controller_1 = require("./controllers/versao-opcional.controller");
const versao_pintura_controller_1 = require("./controllers/versao-pintura.controller");
const marcas_service_1 = require("./services/marcas.service");
const modelos_service_1 = require("./services/modelos.service");
const veiculos_service_1 = require("./services/veiculos.service");
const opcionais_service_1 = require("./services/opcionais.service");
const modelo_opcional_service_1 = require("./services/modelo-opcional.service");
const venda_direta_service_1 = require("./services/venda-direta.service");
const versoes_service_1 = require("./services/versoes.service");
const versao_opcional_service_1 = require("./services/versao-opcional.service");
const versao_pintura_service_1 = require("./services/versao-pintura.service");
let VeiculosModule = class VeiculosModule {
};
exports.VeiculosModule = VeiculosModule;
exports.VeiculosModule = VeiculosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([marca_entity_1.Marca, modelo_entity_1.Modelo, veiculo_entity_1.Veiculo, opcional_entity_1.Opcional, modelo_opcional_entity_1.ModeloOpcional, venda_direta_entity_1.VendaDireta, versao_entity_1.Versao, versao_opcional_entity_1.VersaoOpcional, versao_pintura_entity_1.VersaoPintura]),
        ],
        controllers: [
            marcas_controller_1.MarcasController,
            modelos_controller_1.ModelosController,
            veiculos_controller_1.VeiculosController,
            opcionais_controller_1.OpcionaisController,
            modelo_opcional_controller_1.ModeloOpcionalController,
            venda_direta_controller_1.VendaDiretaController,
            versoes_controller_1.VersoesController,
            versoes_public_controller_1.VersoesPublicController,
            versao_opcional_controller_1.VersaoOpcionalController,
            versao_pintura_controller_1.VersaoPinturaController,
        ],
        providers: [
            marcas_service_1.MarcasService,
            modelos_service_1.ModelosService,
            veiculos_service_1.VeiculosService,
            opcionais_service_1.OpcionaisService,
            modelo_opcional_service_1.ModeloOpcionalService,
            venda_direta_service_1.VendaDiretaService,
            versoes_service_1.VersoesService,
            versao_opcional_service_1.VersaoOpcionalService,
            versao_pintura_service_1.VersaoPinturaService,
        ],
        exports: [
            marcas_service_1.MarcasService,
            modelos_service_1.ModelosService,
            veiculos_service_1.VeiculosService,
            opcionais_service_1.OpcionaisService,
            modelo_opcional_service_1.ModeloOpcionalService,
            venda_direta_service_1.VendaDiretaService,
            versoes_service_1.VersoesService,
            versao_opcional_service_1.VersaoOpcionalService,
            versao_pintura_service_1.VersaoPinturaService,
        ],
    })
], VeiculosModule);
//# sourceMappingURL=veiculos.module.js.map