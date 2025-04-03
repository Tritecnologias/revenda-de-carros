import { IsString, IsEnum, IsOptional, IsNumber, Min, Max, IsInt, IsDecimal, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVeiculoDto {
  @IsNumber()
  @Type(() => Number)
  marcaId: number;

  @IsNumber()
  @Type(() => Number)
  modeloId: number;

  @IsNumber()
  @Type(() => Number)
  versaoId: number;

  @IsInt()
  @Min(1900)
  @Max(2100)
  @Type(() => Number)
  ano: number;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  motor?: string;

  @IsEnum(['gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido'])
  @IsOptional()
  combustivel?: string;

  @IsEnum(['manual', 'automatico', 'cvt', 'automatizado'])
  @IsOptional()
  cambio?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  preco: number;

  @IsString()
  @IsOptional()
  placa?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  quilometragem?: number;

  @IsEnum(['novo', 'usado'])
  tipo: string;

  @IsUrl({}, { message: 'A URL da imagem deve ser válida' })
  @IsOptional()
  imageUrl?: string;

  @IsEnum(['disponivel', 'reservado', 'vendido'])
  situacao: string;

  @IsEnum(['ativo', 'inativo'])
  status: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  defisicoicms?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  defisicoipi?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  taxicms?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  taxipi?: number;
}

export class UpdateVeiculoDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  marcaId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  modeloId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  versaoId?: number;

  @IsInt()
  @IsOptional()
  @Min(1900)
  @Max(2100)
  @Type(() => Number)
  ano?: number;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  motor?: string;

  @IsEnum(['gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido'])
  @IsOptional()
  combustivel?: string;

  @IsEnum(['manual', 'automatico', 'cvt', 'automatizado'])
  @IsOptional()
  cambio?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  preco?: number;

  @IsString()
  @IsOptional()
  placa?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  quilometragem?: number;

  @IsEnum(['novo', 'usado'])
  @IsOptional()
  tipo?: string;

  @IsUrl({}, { message: 'A URL da imagem deve ser válida' })
  @IsOptional()
  imageUrl?: string;

  @IsEnum(['disponivel', 'reservado', 'vendido'])
  @IsOptional()
  situacao?: string;

  @IsEnum(['ativo', 'inativo'])
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  defisicoicms?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  defisicoipi?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  taxicms?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  taxipi?: number;
}
