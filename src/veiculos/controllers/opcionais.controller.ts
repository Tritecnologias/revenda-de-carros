import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { OpcionaisService } from '../services/opcionais.service';
import { OpcionalDto, UpdateOpcionalDto } from '../dto/opcional.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import * as path from 'path';
import { InternalServerErrorException } from '@nestjs/common';

@Controller('opcionais')
export class OpcionaisController {
  constructor(private readonly opcionaisService: OpcionaisService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Res() res: Response) {
    return res.sendFile(path.join(process.cwd(), 'src/public/veiculos/opcional.html'));
  }

  @UseGuards(JwtAuthGuard)
  @Get('new')
  newOpcional(@Res() res: Response) {
    return res.sendFile(path.join(process.cwd(), 'src/public/veiculos/opcional.html'));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/edit')
  async editOpcional(@Res() res: Response) {
    return res.sendFile(path.join(process.cwd(), 'src/public/veiculos/opcional.html'));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() opcionalDto: OpcionalDto, @Res() res: Response) {
    try {
      console.log('OpcionaisController: Criando novo opcional', opcionalDto);
      await this.opcionaisService.create(opcionalDto);
      return res.redirect('/opcionais');
    } catch (error) {
      console.error('OpcionaisController: Erro ao criar opcional', error);
      return res.status(500).json({ message: error.message || 'Erro ao criar opcional' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOpcionalDto: UpdateOpcionalDto, @Res() res: Response) {
    try {
      console.log(`OpcionaisController: Atualizando opcional ${id}`, updateOpcionalDto);
      await this.opcionaisService.update(+id, updateOpcionalDto);
      return res.redirect('/opcionais');
    } catch (error) {
      console.error(`OpcionaisController: Erro ao atualizar opcional ${id}`, error);
      return res.status(500).json({ message: error.message || 'Erro ao atualizar opcional' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      console.log(`OpcionaisController: Removendo opcional ${id}`);
      await this.opcionaisService.remove(+id);
      return res.redirect('/opcionais');
    } catch (error) {
      console.error(`OpcionaisController: Erro ao remover opcional ${id}`, error);
      return res.status(500).json({ message: error.message || 'Erro ao remover opcional' });
    }
  }

  // API endpoints
  // Removido o guard JwtAuthGuard para permitir acesso público
  @Get('api/list')
  async listOpcionais() {
    console.log('OpcionaisController: Listando todos os opcionais');
    try {
      const opcionais = await this.opcionaisService.findAll();
      console.log(`OpcionaisController: Encontrados ${opcionais.length} opcionais`);
      return opcionais;
    } catch (error) {
      console.error('OpcionaisController: Erro ao listar opcionais', error);
      throw new InternalServerErrorException('Erro ao listar opcionais');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/:id')
  async getOpcional(@Param('id') id: string) {
    console.log(`OpcionaisController: Buscando opcional ${id}`);
    try {
      const opcional = await this.opcionaisService.findOne(+id);
      console.log(`OpcionaisController: Opcional ${id} encontrado`, opcional);
      return opcional;
    } catch (error) {
      console.error(`OpcionaisController: Erro ao buscar opcional ${id}`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/create')
  async createOpcionalApi(@Body() opcionalDto: OpcionalDto) {
    console.log('OpcionaisController: Criando opcional via API', opcionalDto);
    try {
      const result = await this.opcionaisService.create(opcionalDto);
      console.log('OpcionaisController: Opcional criado com sucesso via API');
      return result;
    } catch (error) {
      console.error('OpcionaisController: Erro ao criar opcional via API', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/:id')
  async updateOpcionalApi(@Param('id') id: string, @Body() updateOpcionalDto: UpdateOpcionalDto) {
    console.log(`OpcionaisController: Atualizando opcional ${id} via API`, updateOpcionalDto);
    try {
      const result = await this.opcionaisService.update(+id, updateOpcionalDto);
      console.log(`OpcionaisController: Opcional ${id} atualizado com sucesso via API`);
      return result;
    } catch (error) {
      console.error(`OpcionaisController: Erro ao atualizar opcional ${id} via API`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/:id')
  async removeOpcionalApi(@Param('id') id: string) {
    console.log(`OpcionaisController: Excluindo opcional ${id} via API`);
    try {
      const result = await this.opcionaisService.remove(+id);
      console.log(`OpcionaisController: Opcional ${id} excluído com sucesso via API`);
      return result;
    } catch (error) {
      console.error(`OpcionaisController: Erro ao excluir opcional ${id} via API`, error);
      throw error;
    }
  }
}
