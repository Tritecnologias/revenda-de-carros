import { OpcionaisService } from '../services/opcionais.service';
import { OpcionalDto, UpdateOpcionalDto } from '../dto/opcional.dto';
import { Response } from 'express';
export declare class OpcionaisController {
    private readonly opcionaisService;
    constructor(opcionaisService: OpcionaisService);
    findAll(res: Response): Promise<void>;
    newOpcional(res: Response): void;
    editOpcional(res: Response): Promise<void>;
    create(opcionalDto: OpcionalDto, res: Response): Promise<void | Response<any, Record<string, any>>>;
    update(id: string, updateOpcionalDto: UpdateOpcionalDto, res: Response): Promise<void | Response<any, Record<string, any>>>;
    remove(id: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    listOpcionais(): Promise<import("../entities/opcional.entity").Opcional[]>;
    getOpcional(id: string): Promise<import("../entities/opcional.entity").Opcional>;
}
