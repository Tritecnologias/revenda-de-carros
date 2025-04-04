import { VersoesService, CreateVersaoDto, UpdateVersaoDto } from '../services/versoes.service';
export declare class VersoesController {
    private readonly versoesService;
    constructor(versoesService: VersoesService);
    create(createVersaoDto: CreateVersaoDto): Promise<import("../entities/versao.entity").Versao>;
    findAll(): Promise<import("../entities/versao.entity").Versao[]>;
    findAllPublic(): Promise<import("../entities/versao.entity").Versao[]>;
    findByModelo(modeloId: string): Promise<import("../entities/versao.entity").Versao[]>;
    findByModeloPublic(modeloId: string): Promise<import("../entities/versao.entity").Versao[]>;
    findOne(id: string): Promise<import("../entities/versao.entity").Versao>;
    findOnePublic(id: string): Promise<import("../entities/versao.entity").Versao>;
    update(id: string, updateVersaoDto: UpdateVersaoDto): Promise<import("../entities/versao.entity").Versao>;
    remove(id: string): Promise<void>;
}
