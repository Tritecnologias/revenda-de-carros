import { IsNotEmpty, IsString } from 'class-validator';

export class OpcionalDto {
  @IsNotEmpty({ message: 'O código é obrigatório' })
  @IsString({ message: 'O código deve ser uma string' })
  codigo: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString({ message: 'A descrição deve ser uma string' })
  descricao: string;
}

export class UpdateOpcionalDto extends OpcionalDto {}
