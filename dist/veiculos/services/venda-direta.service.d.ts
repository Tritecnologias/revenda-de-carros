import { Repository } from 'typeorm';
import { VendaDireta } from '../entities/venda-direta.entity';
import { CreateVendaDiretaDto, UpdateVendaDiretaDto } from '../dto/venda-direta.dto';
import { MarcasService } from './marcas.service';
export declare class VendaDiretaService {
    private vendaDiretaRepository;
    private marcasService;
    constructor(vendaDiretaRepository: Repository<VendaDireta>, marcasService: MarcasService);
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
    create(createVendaDiretaDto: CreateVendaDiretaDto): Promise<VendaDireta>;
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
    remove(id: number): Promise<VendaDireta>;
}
