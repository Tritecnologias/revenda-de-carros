import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Modelo } from './modelo.entity';
import { Opcional } from './opcional.entity';

@Entity('modelo_opcional')
export class ModeloOpcional {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Modelo, modelo => modelo.id)
  @JoinColumn({ name: 'modeloId' })
  modelo: Modelo;

  @Column()
  modeloId: number;

  @ManyToOne(() => Opcional, opcional => opcional.id)
  @JoinColumn({ name: 'opcionalId' })
  opcional: Opcional;

  @Column()
  opcionalId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  preco: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
