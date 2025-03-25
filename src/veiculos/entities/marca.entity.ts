import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Modelo } from './modelo.entity';
import { Veiculo } from './veiculo.entity';

@Entity('marca')
export class Marca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nome: string;

  @Column({
    type: 'enum',
    enum: ['ativo', 'inativo'],
    default: 'ativo'
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Modelo, modelo => modelo.marca)
  modelos: Modelo[];

  @OneToMany(() => Veiculo, veiculo => veiculo.marca)
  veiculos: Veiculo[];
}
