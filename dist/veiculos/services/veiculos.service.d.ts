import { Repository } from 'typeorm';
import { Veiculo } from '../entities/veiculo.entity';
import { CreateVeiculoDto, UpdateVeiculoDto } from '../dto/veiculo.dto';
import { MarcasService } from './marcas.service';
import { ModelosService } from './modelos.service';
import { VersoesService } from './versoes.service';
export declare class VeiculosService {
    private veiculosRepository;
    private marcasService;
    private modelosService;
    private versoesService;
    private readonly logger;
    constructor(veiculosRepository: Repository<Veiculo>, marcasService: MarcasService, modelosService: ModelosService, versoesService: VersoesService);
    findAll(page?: number, limit?: number, modeloId?: number): Promise<{
        items: Veiculo[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Veiculo>;
    create(createVeiculoDto: CreateVeiculoDto): Promise<Veiculo>;
    update(id: number, updateVeiculoDto: UpdateVeiculoDto): Promise<Veiculo>;
    remove(id: number): Promise<Veiculo>;
}
