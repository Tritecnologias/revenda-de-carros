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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguradorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const veiculo_entity_1 = require("./entities/veiculo.entity");
const pintura_entity_1 = require("./entities/pintura.entity");
const modelo_pintura_entity_1 = require("./entities/modelo-pintura.entity");
const modelo_entity_1 = require("../veiculos/entities/modelo.entity");
let ConfiguradorService = class ConfiguradorService {
    constructor(veiculoRepository, pinturaRepository, modeloPinturaRepository, modeloRepository) {
        this.veiculoRepository = veiculoRepository;
        this.pinturaRepository = pinturaRepository;
        this.modeloPinturaRepository = modeloPinturaRepository;
        this.modeloRepository = modeloRepository;
    }
    async getMarcas() {
        const veiculos = await this.veiculoRepository.find();
        return [...new Set(veiculos.map(v => v.marca))];
    }
    async getModelos(marca) {
        const veiculos = await this.veiculoRepository.find({ where: { marca } });
        return [...new Set(veiculos.map(v => v.modelo))];
    }
    async getVersoes(marca, modelo) {
        const veiculos = await this.veiculoRepository.find({ where: { marca, modelo } });
        return veiculos.map(v => v.versao);
    }
    async getVeiculo(marca, modelo, versao) {
        return this.veiculoRepository.findOne({
            where: { marca, modelo, versao }
        });
    }
    async getPinturasParaModelo(modeloId) {
        const modeloPinturas = await this.modeloPinturaRepository.find({
            where: { modeloId },
            relations: ['pintura'],
        });
        return modeloPinturas.map(mp => ({
            id: mp.pintura.id,
            tipo: mp.pintura.tipo,
            nome: mp.pintura.nome,
            preco: mp.preco,
            modeloPinturaId: mp.id
        }));
    }
    async getPinturasParaModeloCards(modeloId) {
        const modeloPinturas = await this.modeloPinturaRepository.find({
            where: { modeloId },
            relations: ['pintura', 'modelo', 'modelo.marca'],
        });
        return modeloPinturas.map(mp => ({
            tipo: mp.pintura.tipo,
            nome: mp.pintura.nome,
            preco: mp.preco
        }));
    }
    async calcularPreco(data) {
        const veiculo = await this.veiculoRepository.findOne({
            where: { id: data.veiculoId },
        });
        if (!veiculo) {
            throw new Error('Veículo não encontrado');
        }
        let precoBase = veiculo.precoPublico;
        let precoPintura = 0;
        if (data.pinturaId) {
            const modeloVeiculo = await this.modeloRepository.findOne({
                where: { nome: veiculo.modelo }
            });
            if (modeloVeiculo) {
                const modeloPintura = await this.modeloPinturaRepository.findOne({
                    where: {
                        modeloId: modeloVeiculo.id,
                        pinturaId: data.pinturaId
                    },
                });
                if (modeloPintura) {
                    precoPintura = modeloPintura.preco;
                }
            }
        }
        const precoTotal = precoBase + precoPintura;
        const desconto = data.desconto ? (precoTotal * data.desconto) / 100 : 0;
        const quantidade = data.quantidade || 1;
        return {
            precoBase,
            precoPintura,
            precoTotal,
            desconto,
            precoFinal: (precoTotal - desconto) * quantidade,
            quantidade,
        };
    }
    async getAllPinturas() {
        return this.pinturaRepository.find();
    }
    async createPintura(createPinturaDto) {
        const pintura = this.pinturaRepository.create(createPinturaDto);
        return this.pinturaRepository.save(pintura);
    }
    async getPinturaById(id) {
        const pintura = await this.pinturaRepository.findOne({ where: { id } });
        if (!pintura) {
            throw new common_1.NotFoundException(`Pintura com ID ${id} não encontrada`);
        }
        return pintura;
    }
    async updatePintura(id, updatePinturaDto) {
        const pintura = await this.getPinturaById(id);
        this.pinturaRepository.merge(pintura, updatePinturaDto);
        return this.pinturaRepository.save(pintura);
    }
    async deletePintura(id) {
        const pintura = await this.getPinturaById(id);
        return this.pinturaRepository.remove(pintura);
    }
    async createModeloPintura(createModeloPinturaDto) {
        const modelo = await this.modeloRepository.findOne({
            where: { id: createModeloPinturaDto.modeloId },
        });
        if (!modelo) {
            throw new common_1.NotFoundException(`Modelo com ID ${createModeloPinturaDto.modeloId} não encontrado`);
        }
        const pintura = await this.pinturaRepository.findOne({
            where: { id: createModeloPinturaDto.pinturaId },
        });
        if (!pintura) {
            throw new common_1.NotFoundException(`Pintura com ID ${createModeloPinturaDto.pinturaId} não encontrada`);
        }
        const existingModeloPintura = await this.modeloPinturaRepository.findOne({
            where: {
                modeloId: createModeloPinturaDto.modeloId,
                pinturaId: createModeloPinturaDto.pinturaId,
            },
        });
        if (existingModeloPintura) {
            existingModeloPintura.preco = createModeloPinturaDto.preco;
            return this.modeloPinturaRepository.save(existingModeloPintura);
        }
        const modeloPintura = this.modeloPinturaRepository.create(createModeloPinturaDto);
        return this.modeloPinturaRepository.save(modeloPintura);
    }
    async getModeloPinturaById(id) {
        const modeloPintura = await this.modeloPinturaRepository.findOne({
            where: { id },
            relations: ['modelo', 'pintura'],
        });
        if (!modeloPintura) {
            throw new common_1.NotFoundException(`Associação de pintura a modelo com ID ${id} não encontrada`);
        }
        return modeloPintura;
    }
    async updateModeloPintura(id, updateModeloPinturaDto) {
        const modeloPintura = await this.getModeloPinturaById(id);
        this.modeloPinturaRepository.merge(modeloPintura, updateModeloPinturaDto);
        return this.modeloPinturaRepository.save(modeloPintura);
    }
    async deleteModeloPintura(id) {
        const modeloPintura = await this.getModeloPinturaById(id);
        return this.modeloPinturaRepository.remove(modeloPintura);
    }
};
exports.ConfiguradorService = ConfiguradorService;
exports.ConfiguradorService = ConfiguradorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(veiculo_entity_1.Veiculo)),
    __param(1, (0, typeorm_1.InjectRepository)(pintura_entity_1.Pintura)),
    __param(2, (0, typeorm_1.InjectRepository)(modelo_pintura_entity_1.ModeloPintura)),
    __param(3, (0, typeorm_1.InjectRepository)(modelo_entity_1.Modelo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ConfiguradorService);
//# sourceMappingURL=configurador.service.js.map