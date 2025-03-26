import { VendaDiretaService } from '../services/venda-direta.service';
import { CreateVendaDiretaDto, UpdateVendaDiretaDto } from '../dto/venda-direta.dto';
export declare class VendaDiretaController {
    private readonly vendaDiretaService;
    constructor(vendaDiretaService: VendaDiretaService);
    findAllPublic(page?: number, limit?: number, marcaId?: number): Promise<{
        items: {
            marca: {
                id: number;
                nome: string;
            };
            id: number;
            nome: string;
            percentual: number;
            marcaId: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOnePublic(id: number): Promise<{
        marca: {
            id: number;
            nome: string;
        };
        id: number;
        nome: string;
        percentual: number;
        marcaId: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number, marcaId?: number): Promise<{
        items: {
            marca: {
                id: number;
                nome: string;
            };
            id: number;
            nome: string;
            percentual: number;
            marcaId: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        marca: {
            id: number;
            nome: string;
        };
        id: number;
        nome: string;
        percentual: number;
        marcaId: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createVendaDiretaDto: CreateVendaDiretaDto): Promise<import("../entities/venda-direta.entity").VendaDireta>;
    update(id: number, updateVendaDiretaDto: UpdateVendaDiretaDto): Promise<{
        marca: {
            id: number;
            nome: string;
        };
        id: number;
        nome: string;
        percentual: number;
        marcaId: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<import("../entities/venda-direta.entity").VendaDireta>;
}
