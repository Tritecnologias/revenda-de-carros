import { Versao } from './versao.entity';
import { Pintura } from '../../configurador/entities/pintura.entity';
export declare class VersaoPintura {
    id: number;
    versao: Versao;
    versaoId: number;
    pintura: Pintura;
    pinturaId: number;
    preco: number;
    imageUrl: string;
}
