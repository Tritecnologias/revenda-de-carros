import { Modelo } from './modelo.entity';
import { Veiculo } from './veiculo.entity';
export declare class Marca {
    id: number;
    nome: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    modelos: Modelo[];
    veiculos: Veiculo[];
}
