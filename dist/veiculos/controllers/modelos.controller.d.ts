import { ModelosService } from '../services/modelos.service';
import { CreateModeloDto, UpdateModeloDto } from '../dto/modelo.dto';
export declare class ModelosController {
    private readonly modelosService;
    constructor(modelosService: ModelosService);
    findAll(page?: number, limit?: number): Promise<{
        items: import("../entities/modelo.entity").Modelo[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllActive(): Promise<import("../entities/modelo.entity").Modelo[]>;
    findAllActivePublic(): Promise<import("../entities/modelo.entity").Modelo[]>;
    findByMarca(marcaId: number): Promise<import("../entities/modelo.entity").Modelo[]>;
    findByMarcaPublic(marcaId: number): Promise<import("../entities/modelo.entity").Modelo[]>;
    findOne(id: number): Promise<import("../entities/modelo.entity").Modelo>;
    create(createModeloDto: CreateModeloDto): Promise<import("../entities/modelo.entity").Modelo>;
    update(id: number, updateModeloDto: UpdateModeloDto): Promise<import("../entities/modelo.entity").Modelo>;
    remove(id: number): Promise<import("../entities/modelo.entity").Modelo>;
}
