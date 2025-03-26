import { VeiculosService } from '../services/veiculos.service';
import { CreateVeiculoDto, UpdateVeiculoDto } from '../dto/veiculo.dto';
export declare class VeiculosController {
    private readonly veiculosService;
    constructor(veiculosService: VeiculosService);
    findAllPublic(page?: number, limit?: number, modeloId?: number): Promise<{
        items: import("../entities/veiculo.entity").Veiculo[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOnePublic(id: number): Promise<import("../entities/veiculo.entity").Veiculo>;
    findAll(page?: number, limit?: number, modeloId?: number): Promise<{
        items: import("../entities/veiculo.entity").Veiculo[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<import("../entities/veiculo.entity").Veiculo>;
    create(createVeiculoDto: CreateVeiculoDto): Promise<import("../entities/veiculo.entity").Veiculo>;
    update(id: number, updateVeiculoDto: UpdateVeiculoDto): Promise<import("../entities/veiculo.entity").Veiculo>;
    remove(id: number): Promise<import("../entities/veiculo.entity").Veiculo>;
}
