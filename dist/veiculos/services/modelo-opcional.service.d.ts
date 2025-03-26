import { Repository } from 'typeorm';
import { ModeloOpcional } from '../entities/modelo-opcional.entity';
import { ModeloOpcionalDto, UpdateModeloOpcionalDto } from '../dto/modelo-opcional.dto';
import { ModelosService } from './modelos.service';
import { OpcionaisService } from './opcionais.service';
export declare class ModeloOpcionalService {
    private modeloOpcionalRepository;
    private modelosService;
    private opcionaisService;
    constructor(modeloOpcionalRepository: Repository<ModeloOpcional>, modelosService: ModelosService, opcionaisService: OpcionaisService);
    findAll(): Promise<ModeloOpcional[]>;
    findByModeloId(modeloId: number): Promise<ModeloOpcional[]>;
    findOne(id: number): Promise<ModeloOpcional>;
    create(modeloOpcionalDto: ModeloOpcionalDto): Promise<ModeloOpcional>;
    update(id: number, updateModeloOpcionalDto: UpdateModeloOpcionalDto): Promise<ModeloOpcional>;
    remove(id: number): Promise<void>;
}
