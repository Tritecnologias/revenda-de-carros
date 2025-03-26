"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsencoesFieldsToVeiculos1740698617265 = void 0;
const typeorm_1 = require("typeorm");
const veiculo_entity_1 = require("../veiculos/entities/veiculo.entity");
const marca_entity_1 = require("../veiculos/entities/marca.entity");
const modelo_entity_1 = require("../veiculos/entities/modelo.entity");
class AddIsencoesFieldsToVeiculos1740698617265 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE veiculos
            ADD COLUMN defisicoicms DECIMAL(10,2) NULL,
            ADD COLUMN defisicoipi DECIMAL(10,2) NULL,
            ADD COLUMN taxicms DECIMAL(10,2) NULL,
            ADD COLUMN taxipi DECIMAL(10,2) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE veiculos
            DROP COLUMN defisicoicms,
            DROP COLUMN defisicoipi,
            DROP COLUMN taxicms,
            DROP COLUMN taxipi
        `);
    }
}
exports.AddIsencoesFieldsToVeiculos1740698617265 = AddIsencoesFieldsToVeiculos1740698617265;
async function runMigration() {
    const dataSource = new typeorm_1.DataSource({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "Flavinha@2022",
        database: "revenda_carros",
        entities: [veiculo_entity_1.Veiculo, marca_entity_1.Marca, modelo_entity_1.Modelo],
        synchronize: false,
    });
    await dataSource.initialize();
    console.log("Conexão com o banco de dados estabelecida");
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    console.log("Executando migração...");
    const migration = new AddIsencoesFieldsToVeiculos1740698617265();
    await migration.up(queryRunner);
    console.log("Migração concluída com sucesso!");
    await queryRunner.release();
    await dataSource.destroy();
}
if (require.main === module) {
    runMigration()
        .then(() => console.log("Processo concluído"))
        .catch(error => console.error("Erro durante a migração:", error));
}
//# sourceMappingURL=1740698617265-AddIsencoesFieldsToVeiculos.js.map