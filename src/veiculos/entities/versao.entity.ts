import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Modelo } from './modelo.entity';
import { VersaoPintura } from './versao-pintura.entity';

@Entity('versao')
export class Versao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome_versao: string;

  @Column({ default: 'ativo' })
  status: string;

  @ManyToOne(() => Modelo)
  @JoinColumn({ name: 'modeloId' })
  modelo: Modelo;

  @Column({ nullable: false })
  modeloId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relação com VersaoPintura
  @OneToMany(() => VersaoPintura, (versaoPintura) => versaoPintura.versao)
  versaoPinturas?: VersaoPintura[];
}
