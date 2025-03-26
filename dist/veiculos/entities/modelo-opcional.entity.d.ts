import { Modelo } from './modelo.entity';
import { Opcional } from './opcional.entity';
export declare class ModeloOpcional {
    id: number;
    modelo: Modelo;
    modeloId: number;
    opcional: Opcional;
    opcionalId: number;
    preco: number;
    createdAt: Date;
    updatedAt: Date;
}
