import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ModeloPintura } from './modelo-pintura.entity';

@Entity()
export class Pintura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string; // 'SÓLIDA' ou 'METÁLICA'

  @Column()
  nome: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => ModeloPintura, modeloPintura => modeloPintura.pintura)
  modeloPinturas: ModeloPintura[];
}
