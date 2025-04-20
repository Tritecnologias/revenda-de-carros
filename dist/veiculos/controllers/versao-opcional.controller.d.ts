import { VersaoOpcionalService } from '../services/versao-opcional.service';
import { CreateVersaoOpcionalDto, UpdateVersaoOpcionalDto } from '../dto/versao-opcional.dto';
export declare class VersaoOpcionalController {
    private readonly versaoOpcionalService;
    constructor(versaoOpcionalService: VersaoOpcionalService);
    findAllPublic(page?: number, limit?: number, versaoId?: number): Promise<{
        items: import("../entities/versao-opcional.entity").VersaoOpcional[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByVersaoPublic(id: number): Promise<import("../entities/versao-opcional.entity").VersaoOpcional[]>;
    findAll(page?: number, limit?: number, versaoId?: number): Promise<{
        items: import("../entities/versao-opcional.entity").VersaoOpcional[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<import("../entities/versao-opcional.entity").VersaoOpcional>;
    findByVersao(id: number): Promise<import("../entities/versao-opcional.entity").VersaoOpcional[]>;
    create(createVersaoOpcionalDto: CreateVersaoOpcionalDto): Promise<import("../entities/versao-opcional.entity").VersaoOpcional>;
    update(id: number, updateVersaoOpcionalDto: UpdateVersaoOpcionalDto): Promise<import("../entities/versao-opcional.entity").VersaoOpcional>;
    remove(id: number): Promise<import("../entities/versao-opcional.entity").VersaoOpcional>;
}
