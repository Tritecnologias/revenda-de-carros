"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const configurador_module_1 = require("./configurador/configurador.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const veiculos_module_1 = require("./veiculos/veiculos.module");
const veiculo_entity_1 = require("./configurador/entities/veiculo.entity");
const pintura_entity_1 = require("./configurador/entities/pintura.entity");
const modelo_pintura_entity_1 = require("./configurador/entities/modelo-pintura.entity");
const user_entity_1 = require("./users/entities/user.entity");
const marca_entity_1 = require("./veiculos/entities/marca.entity");
const modelo_entity_1 = require("./veiculos/entities/modelo.entity");
const veiculo_entity_2 = require("./veiculos/entities/veiculo.entity");
const opcional_entity_1 = require("./veiculos/entities/opcional.entity");
const modelo_opcional_entity_1 = require("./veiculos/entities/modelo-opcional.entity");
const venda_direta_entity_1 = require("./veiculos/entities/venda-direta.entity");
const versao_entity_1 = require("./veiculos/entities/versao.entity");
const versao_opcional_entity_1 = require("./veiculos/entities/versao-opcional.entity");
const versao_pintura_entity_1 = require("./veiculos/entities/versao-pintura.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: '127.0.0.1',
                port: 3306,
                username: 'wanderson',
                password: 'Flavinha@2022',
                database: 'revenda_carros',
                entities: [veiculo_entity_1.Veiculo, pintura_entity_1.Pintura, modelo_pintura_entity_1.ModeloPintura, user_entity_1.User, marca_entity_1.Marca, modelo_entity_1.Modelo, veiculo_entity_2.Veiculo, opcional_entity_1.Opcional, modelo_opcional_entity_1.ModeloOpcional, venda_direta_entity_1.VendaDireta, versao_entity_1.Versao, versao_opcional_entity_1.VersaoOpcional, versao_pintura_entity_1.VersaoPintura],
                synchronize: true,
            }),
            configurador_module_1.ConfiguradorModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            veiculos_module_1.VeiculosModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map