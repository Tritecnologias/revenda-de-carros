import { Repository } from 'typeorm';
import { Veiculo } from './entities/veiculo.entity';
import { Pintura } from './entities/pintura.entity';
import { ModeloPintura } from './entities/modelo-pintura.entity';
import { CreatePinturaDto } from './dto/create-pintura.dto';
import { CreateModeloPinturaDto } from './dto/create-modelo-pintura.dto';
import { Modelo } from '../veiculos/entities/modelo.entity';
export declare class ConfiguradorService {
    private veiculoRepository;
    private pinturaRepository;
    private modeloPinturaRepository;
    private modeloRepository;
    constructor(veiculoRepository: Repository<Veiculo>, pinturaRepository: Repository<Pintura>, modeloPinturaRepository: Repository<ModeloPintura>, modeloRepository: Repository<Modelo>);
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
        imageUrl: string;
    }[]>;
    getPinturasParaModeloCards(modeloId: number): Promise<{
        tipo: string;
        nome: string;
        preco: number;
        imageUrl: string;
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
    getAllPinturas(): Promise<Pintura[]>;
    createPintura(createPinturaDto: CreatePinturaDto): Promise<Pintura>;
    getPinturaById(id: number): Promise<Pintura>;
    updatePintura(id: number, updatePinturaDto: CreatePinturaDto): Promise<Pintura>;
    deletePintura(id: number): Promise<Pintura>;
    createModeloPintura(createModeloPinturaDto: CreateModeloPinturaDto): Promise<ModeloPintura>;
    getModeloPinturaById(id: number): Promise<ModeloPintura>;
    updateModeloPintura(id: number, updateModeloPinturaDto: CreateModeloPinturaDto): Promise<ModeloPintura>;
    deleteModeloPintura(id: number): Promise<ModeloPintura>;
}
