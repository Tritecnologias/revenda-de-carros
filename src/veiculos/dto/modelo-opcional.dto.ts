import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ModeloOpcionalDto {
  @IsNotEmpty({ message: 'O modelo é obrigatório' })
  @IsNumber({}, { message: 'O ID do modelo deve ser um número' })
  @Type(() => Number)
  modeloId: number;

  @IsNotEmpty({ message: 'O opcional é obrigatório' })
  @IsNumber({}, { message: 'O ID do opcional deve ser um número' })
  @Type(() => Number)
  opcionalId: number;

  @IsNotEmpty({ message: 'O preço é obrigatório' })
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  @Type(() => Number)
  preco: number;
}

export class UpdateModeloOpcionalDto extends ModeloOpcionalDto {}
