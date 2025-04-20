import { VersaoPinturaService } from '../services/versao-pintura.service';
export declare class VersaoPinturaController {
    private readonly versaoPinturaService;
    constructor(versaoPinturaService: VersaoPinturaService);
    findAll(): Promise<import("../entities/versao-pintura.entity").VersaoPintura[]>;
    findOne(id: number): Promise<import("../entities/versao-pintura.entity").VersaoPintura>;
    create(data: any): Promise<import("../entities/versao-pintura.entity").VersaoPintura>;
    update(id: number, data: any): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    findByVersaoId(id: number): Promise<{
        id: number;
        nome: string;
        tipo: string;
        preco: number;
        imageUrl: string;
    }[]>;
}
