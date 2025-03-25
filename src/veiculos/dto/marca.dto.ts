import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  nome: string;

  @IsEnum(['ativo', 'inativo'])
  @IsOptional()
  status?: string = 'ativo';
}

export class UpdateMarcaDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsEnum(['ativo', 'inativo'])
  @IsOptional()
  status?: string;
}
