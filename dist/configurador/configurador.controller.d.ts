import { ConfiguradorService } from './configurador.service';
import { Veiculo } from './entities/veiculo.entity';
import { CreatePinturaDto } from './dto/create-pintura.dto';
import { CreateModeloPinturaDto } from './dto/create-modelo-pintura.dto';
export declare class ConfiguradorController {
    private readonly configuradorService;
    constructor(configuradorService: ConfiguradorService);
    getMarcas(): Promise<string[]>;
    getModelos(marca: string): Promise<string[]>;
    getVersoes(marca: string, modelo: string): Promise<string[]>;
    getVeiculo(marca: string, modelo: string, versao: string): Promise<Veiculo>;
    getPinturasParaModelo(modeloId: number): Promise<{
        id: number;
        tipo: string;
        nome: string;
        preco: number;
        modeloPinturaId: number;
    }[]>;
    getPinturasParaModeloCards(modeloId: number): Promise<{
        tipo: string;
        nome: string;
        preco: number;
    }[]>;
    calcularPreco(data: {
        veiculoId: number;
        pinturaId?: number;
        desconto?: number;
        quantidade?: number;
    }): Promise<{
        precoBase: number;
        precoPintura: number;
        precoTotal: number;
        desconto: number;
        precoFinal: number;
        quantidade: number;
    }>;
    getAllPinturas(): Promise<import("./entities/pintura.entity").Pintura[]>;
    createPintura(createPinturaDto: CreatePinturaDto): Promise<import("./entities/pintura.entity").Pintura>;
    getPinturaById(id: number): Promise<import("./entities/pintura.entity").Pintura>;
    updatePintura(id: number, updatePinturaDto: CreatePinturaDto): Promise<import("./entities/pintura.entity").Pintura>;
    deletePintura(id: number): Promise<import("./entities/pintura.entity").Pintura>;
    createModeloPintura(createModeloPinturaDto: CreateModeloPinturaDto): Promise<import("./entities/modelo-pintura.entity").ModeloPintura>;
    getModeloPinturaById(id: number): Promise<import("./entities/modelo-pintura.entity").ModeloPintura>;
    updateModeloPintura(id: number, updateModeloPinturaDto: CreateModeloPinturaDto): Promise<import("./entities/modelo-pintura.entity").ModeloPintura>;
    deleteModeloPintura(id: number): Promise<import("./entities/modelo-pintura.entity").ModeloPintura>;
}
