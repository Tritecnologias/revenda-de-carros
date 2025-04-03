import { Repository } from 'typeorm';
import { Versao } from '../entities/versao.entity';
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
    private modelosService;
    constructor(versaoRepository: Repository<Versao>, modelosService: ModelosService);
    findAll(): Promise<Versao[]>;
    findOne(id: number): Promise<Versao>;
    findByModelo(modeloId: number): Promise<Versao[]>;
    create(createVersaoDto: CreateVersaoDto): Promise<Versao>;
    update(id: number, updateVersaoDto: UpdateVersaoDto): Promise<Versao>;
    remove(id: number): Promise<void>;
}
