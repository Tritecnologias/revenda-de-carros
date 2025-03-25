import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateModeloPinturaDto {
  @IsNotEmpty()
  @IsNumber()
  modeloId: number;

  @IsNotEmpty()
  @IsNumber()
  pinturaId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  preco: number;
}
