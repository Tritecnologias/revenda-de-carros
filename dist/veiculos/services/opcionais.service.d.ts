import { Repository } from 'typeorm';
import { Opcional } from '../entities/opcional.entity';
import { OpcionalDto, UpdateOpcionalDto } from '../dto/opcional.dto';
export declare class OpcionaisService {
    private opcionaisRepository;
    constructor(opcionaisRepository: Repository<Opcional>);
    findAll(): Promise<Opcional[]>;
    findOne(id: number): Promise<Opcional>;
    create(opcionalDto: OpcionalDto): Promise<Opcional>;
    update(id: number, updateOpcionalDto: UpdateOpcionalDto): Promise<Opcional>;
    remove(id: number): Promise<void>;
}
