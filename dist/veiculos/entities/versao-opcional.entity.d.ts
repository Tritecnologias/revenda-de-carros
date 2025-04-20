import { Versao } from './versao.entity';
import { Opcional } from './opcional.entity';
export declare class VersaoOpcional {
    id: number;
    versao_id: number;
    opcional_id: number;
    preco: number;
    versao: Versao;
    opcional: Opcional;
    created_at: Date;
    updated_at: Date;
}
