import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Modelo } from '../../veiculos/entities/modelo.entity';
import { Pintura } from './pintura.entity';

@Entity('modelo_pintura')
export class ModeloPintura {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Modelo, modelo => modelo.modeloPinturas)
  @JoinColumn({ name: 'modeloId' })
  modelo: Modelo;

  @Column()
  modeloId: number;

  @ManyToOne(() => Pintura, pintura => pintura.modeloPinturas)
  @JoinColumn({ name: 'pinturaId' })
  pintura: Pintura;

  @Column()
  pinturaId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;
}
