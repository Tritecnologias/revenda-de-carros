import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Marca } from './marca.entity';
import { Veiculo } from './veiculo.entity';
import { ModeloPintura } from '../../configurador/entities/modelo-pintura.entity';

@Entity('modelo')
export class Modelo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ default: 'ativo' })
  status: string;

  @ManyToOne(() => Marca, marca => marca.modelos)
  @JoinColumn({ name: 'marcaId' })
  marca: Marca;

  @Column({ nullable: true })
  marcaId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Veiculo, veiculo => veiculo.modelo)
  veiculos: Veiculo[];
  
  @OneToMany(() => ModeloPintura, modeloPintura => modeloPintura.modelo)
  modeloPinturas: ModeloPintura[];
}
