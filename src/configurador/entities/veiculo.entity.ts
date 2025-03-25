import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Veiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column()
  versao: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precoPublico: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoZonaFranca: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoPcdIpi: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoTaxiIpiIcms: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoTaxiIpi: number;
}
