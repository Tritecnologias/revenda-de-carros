import { DataSource } from 'typeorm';
import { createInitialUser } from './initial-user.seed';
import { User } from '../../users/entities/user.entity';
import { Veiculo } from '../../configurador/entities/veiculo.entity';
import { Pintura } from '../../configurador/entities/pintura.entity';

const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Flavinha@2022',
    database: 'revenda_carros',
    entities: [User, Veiculo, Pintura],
    synchronize: true,
});

async function runSeeds() {
    try {
        await dataSource.initialize();
        console.log('Connected to database');

        await createInitialUser(dataSource);
        console.log('All seeds executed successfully');

    } catch (error) {
        console.error('Error running seeds:', error);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}

runSeeds();
