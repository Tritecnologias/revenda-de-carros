import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Versao } from './versao.entity';
import { Opcional } from './opcional.entity';

@Entity('versao_opcional')
export class VersaoOpcional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  versao_id: number;

  @Column()
  opcional_id: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  preco: number;

  @ManyToOne(() => Versao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'versao_id' })
  versao: Versao;

  @ManyToOne(() => Opcional, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'opcional_id' })
  opcional: Opcional;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
