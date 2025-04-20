import { Repository } from 'typeorm';
import { Versao } from '../entities/versao.entity';
import { Veiculo } from '../entities/veiculo.entity';
import { ModelosService } from './modelos.service';
export declare class CreateVersaoDto {
    nome_versao: string;
    modeloId: number;
    status?: string;
}
export declare class UpdateVersaoDto {
    nome_versao?: string;
    modeloId?: number;
    status?: string;
}
export declare class VersoesService {
    private versaoRepository;
    private veiculosRepository;
    private modelosService;
    constructor(versaoRepository: Repository<Versao>, veiculosRepository: Repository<Veiculo>, modelosService: ModelosService);
    findAll(): Promise<Versao[]>;
    findOne(id: number): Promise<Versao>;
    findByModelo(modeloId: number): Promise<any[]>;
    create(createVersaoDto: CreateVersaoDto): Promise<Versao>;
    update(id: number, updateVersaoDto: UpdateVersaoDto): Promise<Versao>;
    remove(id: number): Promise<void>;
}
