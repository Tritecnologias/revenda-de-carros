import { ModeloOpcionalService } from '../services/modelo-opcional.service';
import { ModeloOpcionalDto, UpdateModeloOpcionalDto } from '../dto/modelo-opcional.dto';
export declare class ModeloOpcionalController {
    private readonly modeloOpcionalService;
    constructor(modeloOpcionalService: ModeloOpcionalService);
    findAll(): Promise<import("../entities/modelo-opcional.entity").ModeloOpcional[]>;
    findByModeloId(modeloId: string): Promise<import("../entities/modelo-opcional.entity").ModeloOpcional[]>;
    findByModeloPublic(modeloId: number): Promise<{
        id: number;
        codigo: string;
        descricao: string;
        preco: number;
        opcionalId: number;
        modeloId: number;
    }[]>;
    findOne(id: string): Promise<import("../entities/modelo-opcional.entity").ModeloOpcional>;
    create(modeloOpcionalDto: ModeloOpcionalDto): Promise<import("../entities/modelo-opcional.entity").ModeloOpcional>;
    update(id: string, updateModeloOpcionalDto: UpdateModeloOpcionalDto): Promise<import("../entities/modelo-opcional.entity").ModeloOpcional>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
