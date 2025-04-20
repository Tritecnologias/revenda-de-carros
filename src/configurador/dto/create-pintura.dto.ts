import { IsString, IsEnum } from 'class-validator';

export class CreatePinturaDto {
  @IsEnum(['SÓLIDA', 'METÁLICA'], { message: 'Tipo deve ser SÓLIDA ou METÁLICA' })
  tipo: string;

  @IsString()
  nome: string;
}
