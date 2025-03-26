import { Marca } from './marca.entity';
import { Modelo } from './modelo.entity';
export declare class Veiculo {
    id: number;
    marca: Marca;
    marcaId: number;
    modelo: Modelo;
    modeloId: number;
    versao: string;
    ano: number;
    descricao: string;
    motor: string;
    combustivel: string;
    cambio: string;
    preco: number;
    quilometragem: number;
    tipo: string;
    situacao: string;
    status: string;
    defisicoicms: number;
    defisicoipi: number;
    taxicms: number;
    taxipi: number;
    createdAt: Date;
    updatedAt: Date;
}
