import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateVendaDiretaDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentual: number;

  @IsNotEmpty()
  @IsNumber()
  marcaId: number;
}

export class UpdateVendaDiretaDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentual?: number;

  @IsOptional()
  @IsNumber()
  marcaId?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
