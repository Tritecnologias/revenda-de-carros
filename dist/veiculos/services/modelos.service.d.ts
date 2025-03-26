import { Repository } from 'typeorm';
import { Modelo } from '../entities/modelo.entity';
import { CreateModeloDto, UpdateModeloDto } from '../dto/modelo.dto';
import { MarcasService } from './marcas.service';
export declare class ModelosService {
    private modelosRepository;
    private marcasService;
    constructor(modelosRepository: Repository<Modelo>, marcasService: MarcasService);
    findAll(page?: number, limit?: number): Promise<{
        items: Modelo[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllActive(): Promise<Modelo[]>;
    findByMarca(marcaId: number): Promise<Modelo[]>;
    findOne(id: number): Promise<Modelo>;
    create(createModeloDto: CreateModeloDto): Promise<Modelo>;
    update(id: number, updateModeloDto: UpdateModeloDto): Promise<Modelo>;
    remove(id: number): Promise<Modelo>;
}
