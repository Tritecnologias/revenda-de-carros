import { VersoesService } from '../services/versoes.service';
export declare class VersoesPublicController {
    private readonly versoesService;
    constructor(versoesService: VersoesService);
    findAll(): Promise<import("../entities/versao.entity").Versao[]>;
    findAllAlternative(): Promise<import("../entities/versao.entity").Versao[]>;
    findByModelo(modeloId: string): Promise<any[]>;
    findOne(id: string): Promise<import("../entities/versao.entity").Versao>;
}
