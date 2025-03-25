import { DataSource } from 'typeorm';
import { Veiculo as ConfiguradorVeiculo } from './src/configurador/entities/veiculo.entity';
import { Pintura } from './src/configurador/entities/pintura.entity';
import { ModeloPintura } from './src/configurador/entities/modelo-pintura.entity';
import { User } from './src/users/entities/user.entity';
import { Marca } from './src/veiculos/entities/marca.entity';
import { Modelo } from './src/veiculos/entities/modelo.entity';
import { Veiculo } from './src/veiculos/entities/veiculo.entity';
import { Opcional } from './src/veiculos/entities/opcional.entity';
import { ModeloOpcional } from './src/veiculos/entities/modelo-opcional.entity';
import { VendaDireta } from './src/veiculos/entities/venda-direta.entity';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Flavinha@2022',
  database: 'revenda_carros',
  entities: [ConfiguradorVeiculo, Pintura, ModeloPintura, User, Marca, Modelo, Veiculo, Opcional, ModeloOpcional, VendaDireta],
  migrations: ['src/migrations/*.ts'],
  synchronize: true, // Temporariamente habilitado para sincronizar as entidades
});
