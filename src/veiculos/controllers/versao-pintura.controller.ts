import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { VersaoPinturaService } from '../services/versao-pintura.service';

@Controller('api/veiculos/versao-pintura')
export class VersaoPinturaController {
  constructor(private readonly versaoPinturaService: VersaoPinturaService) {}

  @Get('public')
  findAll() {
    return this.versaoPinturaService.findAll();
  }

  @Get('public/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.versaoPinturaService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.versaoPinturaService.create(data);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.versaoPinturaService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.versaoPinturaService.remove(id);
  }

  // Endpoint para buscar pinturas associadas a uma versão específica
  @Get('versao/:id/public')
  findByVersaoId(@Param('id', ParseIntPipe) id: number) {
    return this.versaoPinturaService.findByVersaoId(id);
  }
}
