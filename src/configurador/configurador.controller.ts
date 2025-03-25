import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ConfiguradorService } from './configurador.service';
import { Veiculo } from './entities/veiculo.entity';
import { CreatePinturaDto } from './dto/create-pintura.dto';
import { CreateModeloPinturaDto } from './dto/create-modelo-pintura.dto';

@Controller('configurador')
export class ConfiguradorController {
  constructor(private readonly configuradorService: ConfiguradorService) {}

  @Get('marcas')
  async getMarcas(): Promise<string[]> {
    return this.configuradorService.getMarcas();
  }

  @Get('modelos/:marca')
  async getModelos(@Param('marca') marca: string): Promise<string[]> {
    return this.configuradorService.getModelos(marca);
  }

  @Get('versoes/:marca/:modelo')
  async getVersoes(
    @Param('marca') marca: string,
    @Param('modelo') modelo: string,
  ): Promise<string[]> {
    return this.configuradorService.getVersoes(marca, modelo);
  }

  @Get('veiculo/:marca/:modelo/:versao')
  async getVeiculo(
    @Param('marca') marca: string,
    @Param('modelo') modelo: string,
    @Param('versao') versao: string,
  ): Promise<Veiculo> {
    return this.configuradorService.getVeiculo(marca, modelo, versao);
  }

  @Get('pinturas/modelo/:modeloId')
  async getPinturasParaModelo(@Param('modeloId', ParseIntPipe) modeloId: number) {
    return this.configuradorService.getPinturasParaModelo(modeloId);
  }

  @Get('pinturas/modelo/:modeloId/cards')
  async getPinturasParaModeloCards(@Param('modeloId', ParseIntPipe) modeloId: number) {
    return this.configuradorService.getPinturasParaModeloCards(modeloId);
  }

  @Post('calcular-preco')
  async calcularPreco(
    @Body() data: {
      veiculoId: number;
      pinturaId?: number;
      desconto?: number;
      quantidade?: number;
    },
  ) {
    return this.configuradorService.calcularPreco(data);
  }

  // Endpoints para gerenciar pinturas
  @Get('pinturas')
  async getAllPinturas() {
    return this.configuradorService.getAllPinturas();
  }

  @Post('pinturas')
  async createPintura(@Body() createPinturaDto: CreatePinturaDto) {
    return this.configuradorService.createPintura(createPinturaDto);
  }

  @Get('pinturas/detalhe/:id')
  async getPinturaById(@Param('id', ParseIntPipe) id: number) {
    return this.configuradorService.getPinturaById(id);
  }

  @Put('pinturas/:id')
  async updatePintura(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePinturaDto: CreatePinturaDto,
  ) {
    return this.configuradorService.updatePintura(id, updatePinturaDto);
  }

  @Delete('pinturas/:id')
  async deletePintura(@Param('id', ParseIntPipe) id: number) {
    return this.configuradorService.deletePintura(id);
  }

  // Endpoints para gerenciar associações de pinturas a modelos
  @Post('modelo-pintura')
  async createModeloPintura(@Body() createModeloPinturaDto: CreateModeloPinturaDto) {
    return this.configuradorService.createModeloPintura(createModeloPinturaDto);
  }

  @Get('modelo-pintura/:id')
  async getModeloPinturaById(@Param('id', ParseIntPipe) id: number) {
    return this.configuradorService.getModeloPinturaById(id);
  }

  @Put('modelo-pintura/:id')
  async updateModeloPintura(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModeloPinturaDto: CreateModeloPinturaDto,
  ) {
    return this.configuradorService.updateModeloPintura(id, updateModeloPinturaDto);
  }

  @Delete('modelo-pintura/:id')
  async deleteModeloPintura(@Param('id', ParseIntPipe) id: number) {
    return this.configuradorService.deleteModeloPintura(id);
  }
}
