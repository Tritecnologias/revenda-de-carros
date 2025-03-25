import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from './entities/veiculo.entity';
import { Pintura } from './entities/pintura.entity';
import { ModeloPintura } from './entities/modelo-pintura.entity';
import { CreatePinturaDto } from './dto/create-pintura.dto';
import { CreateModeloPinturaDto } from './dto/create-modelo-pintura.dto';
import { Modelo } from '../veiculos/entities/modelo.entity';

@Injectable()
export class ConfiguradorService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,
    @InjectRepository(Pintura)
    private pinturaRepository: Repository<Pintura>,
    @InjectRepository(ModeloPintura)
    private modeloPinturaRepository: Repository<ModeloPintura>,
    @InjectRepository(Modelo)
    private modeloRepository: Repository<Modelo>,
  ) {}

  async getMarcas(): Promise<string[]> {
    const veiculos = await this.veiculoRepository.find();
    return [...new Set(veiculos.map(v => v.marca))];
  }

  async getModelos(marca: string): Promise<string[]> {
    const veiculos = await this.veiculoRepository.find({ where: { marca } });
    return [...new Set(veiculos.map(v => v.modelo))];
  }

  async getVersoes(marca: string, modelo: string): Promise<string[]> {
    const veiculos = await this.veiculoRepository.find({ where: { marca, modelo } });
    return veiculos.map(v => v.versao);
  }

  async getVeiculo(marca: string, modelo: string, versao: string): Promise<Veiculo> {
    return this.veiculoRepository.findOne({
      where: { marca, modelo, versao }
    });
  }

  async getPinturasParaModelo(modeloId: number) {
    const modeloPinturas = await this.modeloPinturaRepository.find({
      where: { modeloId },
      relations: ['pintura'],
    });
    
    return modeloPinturas.map(mp => ({
      id: mp.pintura.id,
      tipo: mp.pintura.tipo,
      nome: mp.pintura.nome,
      preco: mp.preco,
      modeloPinturaId: mp.id,
      imageUrl: mp.pintura.imageUrl
    }));
  }

  async getPinturasParaModeloCards(modeloId: number) {
    const modeloPinturas = await this.modeloPinturaRepository.find({
      where: { modeloId },
      relations: ['pintura', 'modelo', 'modelo.marca'],
    });
    
    return modeloPinturas.map(mp => ({
      tipo: mp.pintura.tipo,
      nome: mp.pintura.nome,
      preco: mp.preco,
      imageUrl: mp.pintura.imageUrl
    }));
  }

  async calcularPreco(data: {
    veiculoId: number;
    pinturaId?: number;
    desconto?: number;
    quantidade?: number;
  }) {
    const veiculo = await this.veiculoRepository.findOne({
      where: { id: data.veiculoId },
    });

    if (!veiculo) {
      throw new Error('Veículo não encontrado');
    }

    let precoBase = veiculo.precoPublico;
    let precoPintura = 0;

    if (data.pinturaId) {
      // Encontrar o modelo do veículo
      const modeloVeiculo = await this.modeloRepository.findOne({
        where: { nome: veiculo.modelo }
      });

      if (modeloVeiculo) {
        const modeloPintura = await this.modeloPinturaRepository.findOne({
          where: { 
            modeloId: modeloVeiculo.id,
            pinturaId: data.pinturaId 
          },
        });
        
        if (modeloPintura) {
          precoPintura = modeloPintura.preco;
        }
      }
    }

    const precoTotal = precoBase + precoPintura;
    const desconto = data.desconto ? (precoTotal * data.desconto) / 100 : 0;
    const quantidade = data.quantidade || 1;

    return {
      precoBase,
      precoPintura,
      precoTotal,
      desconto,
      precoFinal: (precoTotal - desconto) * quantidade,
      quantidade,
    };
  }

  // Métodos para gerenciar pinturas
  async getAllPinturas() {
    return this.pinturaRepository.find();
  }

  async createPintura(createPinturaDto: CreatePinturaDto) {
    const pintura = this.pinturaRepository.create(createPinturaDto);
    return this.pinturaRepository.save(pintura);
  }

  async getPinturaById(id: number) {
    const pintura = await this.pinturaRepository.findOne({ where: { id } });
    if (!pintura) {
      throw new NotFoundException(`Pintura com ID ${id} não encontrada`);
    }
    return pintura;
  }

  async updatePintura(id: number, updatePinturaDto: CreatePinturaDto) {
    const pintura = await this.getPinturaById(id);
    this.pinturaRepository.merge(pintura, updatePinturaDto);
    return this.pinturaRepository.save(pintura);
  }

  async deletePintura(id: number) {
    const pintura = await this.getPinturaById(id);
    return this.pinturaRepository.remove(pintura);
  }

  // Métodos para gerenciar associações de pinturas a modelos
  async createModeloPintura(createModeloPinturaDto: CreateModeloPinturaDto) {
    // Verificar se o modelo existe
    const modelo = await this.modeloRepository.findOne({
      where: { id: createModeloPinturaDto.modeloId },
    });
    if (!modelo) {
      throw new NotFoundException(`Modelo com ID ${createModeloPinturaDto.modeloId} não encontrado`);
    }

    // Verificar se a pintura existe
    const pintura = await this.pinturaRepository.findOne({
      where: { id: createModeloPinturaDto.pinturaId },
    });
    if (!pintura) {
      throw new NotFoundException(`Pintura com ID ${createModeloPinturaDto.pinturaId} não encontrada`);
    }

    // Verificar se já existe essa associação
    const existingModeloPintura = await this.modeloPinturaRepository.findOne({
      where: {
        modeloId: createModeloPinturaDto.modeloId,
        pinturaId: createModeloPinturaDto.pinturaId,
      },
    });

    if (existingModeloPintura) {
      // Atualizar o preço se já existir
      existingModeloPintura.preco = createModeloPinturaDto.preco;
      return this.modeloPinturaRepository.save(existingModeloPintura);
    }

    // Criar nova associação
    const modeloPintura = this.modeloPinturaRepository.create(createModeloPinturaDto);
    return this.modeloPinturaRepository.save(modeloPintura);
  }

  async getModeloPinturaById(id: number) {
    const modeloPintura = await this.modeloPinturaRepository.findOne({
      where: { id },
      relations: ['modelo', 'pintura'],
    });
    if (!modeloPintura) {
      throw new NotFoundException(`Associação de pintura a modelo com ID ${id} não encontrada`);
    }
    return modeloPintura;
  }

  async updateModeloPintura(id: number, updateModeloPinturaDto: CreateModeloPinturaDto) {
    const modeloPintura = await this.getModeloPinturaById(id);
    this.modeloPinturaRepository.merge(modeloPintura, updateModeloPinturaDto);
    return this.modeloPinturaRepository.save(modeloPintura);
  }

  async deleteModeloPintura(id: number) {
    const modeloPintura = await this.getModeloPinturaById(id);
    return this.modeloPinturaRepository.remove(modeloPintura);
  }
}
