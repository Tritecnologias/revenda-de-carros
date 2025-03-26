import { MarcasService } from '../services/marcas.service';
import { CreateMarcaDto, UpdateMarcaDto } from '../dto/marca.dto';
export declare class MarcasController {
    private readonly marcasService;
    constructor(marcasService: MarcasService);
    findAll(page?: number, limit?: number): Promise<{
        items: import("../entities/marca.entity").Marca[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllActive(): Promise<import("../entities/marca.entity").Marca[]>;
    findAllPublic(): Promise<import("../entities/marca.entity").Marca[]>;
    findOne(id: number): Promise<import("../entities/marca.entity").Marca>;
    create(createMarcaDto: CreateMarcaDto): Promise<import("../entities/marca.entity").Marca>;
    update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<import("../entities/marca.entity").Marca>;
    remove(id: number): Promise<import("../entities/marca.entity").Marca>;
}
