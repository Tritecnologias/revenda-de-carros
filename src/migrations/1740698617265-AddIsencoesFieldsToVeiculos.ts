import { MigrationInterface, QueryRunner, DataSource } from "typeorm";
import { Veiculo } from "../veiculos/entities/veiculo.entity";
import { Marca } from "../veiculos/entities/marca.entity";
import { Modelo } from "../veiculos/entities/modelo.entity";

export class AddIsencoesFieldsToVeiculos1740698617265 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE veiculos
            ADD COLUMN defisicoicms DECIMAL(10,2) NULL,
            ADD COLUMN defisicoipi DECIMAL(10,2) NULL,
            ADD COLUMN taxicms DECIMAL(10,2) NULL,
            ADD COLUMN taxipi DECIMAL(10,2) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE veiculos
            DROP COLUMN defisicoicms,
            DROP COLUMN defisicoipi,
            DROP COLUMN taxicms,
            DROP COLUMN taxipi
        `);
    }
}

// Executar a migração diretamente
async function runMigration() {
    const dataSource = new DataSource({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "Flavinha@2022",
        database: "revenda_carros",
        entities: [Veiculo, Marca, Modelo],
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

// Executar apenas se for chamado diretamente
if (require.main === module) {
    runMigration()
        .then(() => console.log("Processo concluído"))
        .catch(error => console.error("Erro durante a migração:", error));
}
