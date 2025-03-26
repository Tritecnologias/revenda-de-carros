"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const initial_user_seed_1 = require("./initial-user.seed");
const user_entity_1 = require("../../users/entities/user.entity");
const veiculo_entity_1 = require("../../configurador/entities/veiculo.entity");
const pintura_entity_1 = require("../../configurador/entities/pintura.entity");
const dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Flavinha@2022',
    database: 'revenda_carros',
    entities: [user_entity_1.User, veiculo_entity_1.Veiculo, pintura_entity_1.Pintura],
    synchronize: true,
});
async function runSeeds() {
    try {
        await dataSource.initialize();
        console.log('Connected to database');
        await (0, initial_user_seed_1.createInitialUser)(dataSource);
        console.log('All seeds executed successfully');
    }
    catch (error) {
        console.error('Error running seeds:', error);
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}
runSeeds();
//# sourceMappingURL=run-seeds.js.map