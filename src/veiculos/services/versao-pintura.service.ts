import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VersaoPintura } from '../entities/versao-pintura.entity';

@Injectable()
export class VersaoPinturaService {
  constructor(
    @InjectRepository(VersaoPintura)
    private readonly versaoPinturaRepository: Repository<VersaoPintura>,
  ) {}

  findAll() {
    return this.versaoPinturaRepository.find({
      relations: ['versao', 'versao.modelo', 'pintura']
    });
  }

  findOne(id: number) {
    return this.versaoPinturaRepository.findOne({ where: { id } });
  }

  create(data: Partial<VersaoPintura>) {
    const entity = this.versaoPinturaRepository.create(data);
    return this.versaoPinturaRepository.save(entity);
  }

  update(id: number, data: Partial<VersaoPintura>) {
    return this.versaoPinturaRepository.update(id, data);
  }

  remove(id: number) {
    return this.versaoPinturaRepository.delete(id);
  }

  // Método para buscar pinturas associadas a uma versão específica
  async findByVersaoId(versaoId: number) {
    const versaoPinturas = await this.versaoPinturaRepository.find({
      where: { versao: { id: versaoId } },
      relations: ['versao', 'pintura']
    });

    // Retornar apenas as informações das pinturas
    return versaoPinturas.map(vp => ({
      id: vp.pintura.id,
      nome: vp.pintura.nome,
      tipo: vp.pintura.tipo,
      preco: vp.preco,
      imageUrl: vp.imageUrl
    }));
  }
}
