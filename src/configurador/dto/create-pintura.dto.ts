import { IsString, IsEnum, IsOptional, IsUrl } from 'class-validator';

export class CreatePinturaDto {
  @IsEnum(['SÓLIDA', 'METÁLICA'], { message: 'Tipo deve ser SÓLIDA ou METÁLICA' })
  tipo: string;

  @IsString()
  nome: string;

  @IsOptional()
  @IsUrl({}, { message: 'A URL da imagem deve ser válida' })
  imageUrl?: string;
}
