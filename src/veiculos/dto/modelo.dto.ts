import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateModeloDto {
  @IsNumber()
  @Type(() => Number)
  marcaId: number;

  @IsString()
  nome: string;

  @IsEnum(['ativo', 'inativo'])
  @IsOptional()
  status?: string = 'ativo';
}

export class UpdateModeloDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  marcaId?: number;

  @IsString()
  @IsOptional()
  nome?: string;

  @IsEnum(['ativo', 'inativo'])
  @IsOptional()
  status?: string;
}
