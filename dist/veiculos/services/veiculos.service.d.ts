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
    constructor(veiculosRepository: Repository<Veiculo>, marcasService: MarcasService, modelosService: ModelosService, versoesService: VersoesService);
    findAll(page?: number, limit?: number, modeloId?: number): Promise<{
        items: Veiculo[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    findOne(id: number): Promise<Veiculo>;
    create(createVeiculoDto: CreateVeiculoDto): Promise<Veiculo>;
    update(id: number, updateVeiculoDto: UpdateVeiculoDto): Promise<Veiculo>;
    remove(id: number): Promise<Veiculo>;
}
