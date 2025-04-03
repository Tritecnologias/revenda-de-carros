import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Marca } from './marca.entity';
import { Modelo } from './modelo.entity';
import { Versao } from './versao.entity';

@Entity('veiculos')
export class Veiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Marca, marca => marca.veiculos)
  @JoinColumn({ name: 'marcaId' })
  marca: Marca;

  @Column({ nullable: true })
  marcaId: number;

  @ManyToOne(() => Modelo, modelo => modelo.veiculos)
  @JoinColumn({ name: 'modeloId' })
  modelo: Modelo;

  @Column({ nullable: true })
  modeloId: number;

  @ManyToOne(() => Versao)
  @JoinColumn({ name: 'versaoId' })
  versao: Versao;

  @Column({ nullable: true })
  versaoId: number;

  @Column()
  ano: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ nullable: true })
  motor: string;

  @Column({ nullable: true })
  combustivel: string;

  @Column({ nullable: true })
  cambio: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column({ nullable: true })
  quilometragem: number;

  @Column({ default: 'novo' })
  tipo: string;

  @Column({ default: 'disponivel' })
  situacao: string;

  @Column({ default: 'ativo' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  defisicoicms: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  defisicoipi: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxicms: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxipi: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
