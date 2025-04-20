import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Versao } from './versao.entity';
import { Pintura } from '../../configurador/entities/pintura.entity';

@Entity()
export class VersaoPintura {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Versao, versao => versao.versaoPinturas, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'versaoId' })
  versao: Versao;

  @Column()
  versaoId: number;

  @ManyToOne(() => Pintura, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pinturaId' })
  pintura: Pintura;

  @Column()
  pinturaId: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  preco: number;

  @Column({ nullable: true })
  imageUrl: string;
}
