import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateVersaoOpcionalDto {
  @IsNotEmpty({ message: 'O ID da versão é obrigatório' })
  @IsNumber({}, { message: 'O ID da versão deve ser um número' })
  versao_id: number;

  @IsNotEmpty({ message: 'O ID do opcional é obrigatório' })
  @IsNumber({}, { message: 'O ID do opcional deve ser um número' })
  opcional_id: number;

  @IsNotEmpty({ message: 'O preço é obrigatório' })
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  preco: number;
}

export class UpdateVersaoOpcionalDto {
  @IsOptional()
  @IsNumber({}, { message: 'O ID da versão deve ser um número' })
  versao_id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'O ID do opcional deve ser um número' })
  opcional_id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  preco?: number;
}
