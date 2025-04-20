import { Repository } from 'typeorm';
import { VersaoPintura } from '../entities/versao-pintura.entity';
export declare class VersaoPinturaService {
    private readonly versaoPinturaRepository;
    constructor(versaoPinturaRepository: Repository<VersaoPintura>);
    findAll(): Promise<VersaoPintura[]>;
    findOne(id: number): Promise<VersaoPintura>;
    create(data: Partial<VersaoPintura>): Promise<VersaoPintura>;
    update(id: number, data: Partial<VersaoPintura>): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    findByVersaoId(versaoId: number): Promise<{
        id: number;
        nome: string;
        tipo: string;
        preco: number;
        imageUrl: string;
    }[]>;
}
