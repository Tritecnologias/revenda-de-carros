import { Modelo } from './modelo.entity';
export declare class Versao {
    id: number;
    nome_versao: string;
    status: string;
    modelo: Modelo;
    modeloId: number;
    createdAt: Date;
    updatedAt: Date;
}
