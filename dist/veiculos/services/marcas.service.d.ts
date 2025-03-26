import { Repository } from 'typeorm';
import { Marca } from '../entities/marca.entity';
import { CreateMarcaDto, UpdateMarcaDto } from '../dto/marca.dto';
export declare class MarcasService {
    private marcasRepository;
    constructor(marcasRepository: Repository<Marca>);
    findAll(page?: number, limit?: number): Promise<{
        items: Marca[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllActive(): Promise<Marca[]>;
    findOne(id: number): Promise<Marca>;
    create(createMarcaDto: CreateMarcaDto): Promise<Marca>;
    update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca>;
    remove(id: number): Promise<Marca>;
}
