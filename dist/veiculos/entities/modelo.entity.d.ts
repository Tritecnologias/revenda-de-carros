import { Marca } from './marca.entity';
import { Veiculo } from './veiculo.entity';
import { ModeloPintura } from '../../configurador/entities/modelo-pintura.entity';
export declare class Modelo {
    id: number;
    nome: string;
    status: string;
    marca: Marca;
    marcaId: number;
    createdAt: Date;
    updatedAt: Date;
    veiculos: Veiculo[];
    modeloPinturas: ModeloPintura[];
}
