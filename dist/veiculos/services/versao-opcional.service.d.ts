import { Repository } from 'typeorm';
import { VersaoOpcional } from '../entities/versao-opcional.entity';
import { CreateVersaoOpcionalDto, UpdateVersaoOpcionalDto } from '../dto/versao-opcional.dto';
import { VersoesService } from './versoes.service';
import { OpcionaisService } from './opcionais.service';
export declare class VersaoOpcionalService {
    private versaoOpcionalRepository;
    private versoesService;
    private opcionaisService;
    constructor(versaoOpcionalRepository: Repository<VersaoOpcional>, versoesService: VersoesService, opcionaisService: OpcionaisService);
    findAll(page?: number, limit?: number, versaoId?: number): Promise<{
        items: VersaoOpcional[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<VersaoOpcional>;
    findByVersao(versaoId: number): Promise<VersaoOpcional[]>;
    create(createVersaoOpcionalDto: CreateVersaoOpcionalDto): Promise<VersaoOpcional>;
    update(id: number, updateVersaoOpcionalDto: UpdateVersaoOpcionalDto): Promise<VersaoOpcional>;
    remove(id: number): Promise<VersaoOpcional>;
    findByVersaoPublic(versaoId: number): Promise<VersaoOpcional[]>;
}
