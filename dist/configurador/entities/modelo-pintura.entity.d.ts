import { Modelo } from '../../veiculos/entities/modelo.entity';
import { Pintura } from './pintura.entity';
export declare class ModeloPintura {
    id: number;
    modelo: Modelo;
    modeloId: number;
    pintura: Pintura;
    pinturaId: number;
    preco: number;
}
