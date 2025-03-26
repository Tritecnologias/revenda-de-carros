"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVeiculosEntities1708978800000 = void 0;
class CreateVeiculosEntities1708978800000 {
    constructor() {
        this.name = 'CreateVeiculosEntities1708978800000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`marca\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`nome\` varchar(255) NOT NULL,
                \`status\` varchar(255) NOT NULL DEFAULT 'ativo',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`modelo\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`nome\` varchar(255) NOT NULL,
                \`status\` varchar(255) NOT NULL DEFAULT 'ativo',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`marcaId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`veiculos\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`versao\` varchar(255) NOT NULL,
                \`ano\` int NOT NULL,
                \`descricao\` text NULL,
                \`motor\` varchar(255) NULL,
                \`combustivel\` varchar(255) NULL,
                \`cambio\` varchar(255) NULL,
                \`preco\` decimal(10,2) NOT NULL,
                \`quilometragem\` int NULL,
                \`tipo\` varchar(255) NOT NULL DEFAULT 'novo',
                \`situacao\` varchar(255) NOT NULL DEFAULT 'disponivel',
                \`status\` varchar(255) NOT NULL DEFAULT 'ativo',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`marcaId\` int NULL,
                \`modeloId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`modelo\` ADD CONSTRAINT \`FK_modelo_marca\` FOREIGN KEY (\`marcaId\`) REFERENCES \`marca\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`veiculos\` ADD CONSTRAINT \`FK_veiculos_marca\` FOREIGN KEY (\`marcaId\`) REFERENCES \`marca\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`veiculos\` ADD CONSTRAINT \`FK_veiculos_modelo\` FOREIGN KEY (\`modeloId\`) REFERENCES \`modelo\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`veiculos\` DROP FOREIGN KEY \`FK_veiculos_modelo\``);
        await queryRunner.query(`ALTER TABLE \`veiculos\` DROP FOREIGN KEY \`FK_veiculos_marca\``);
        await queryRunner.query(`ALTER TABLE \`modelo\` DROP FOREIGN KEY \`FK_modelo_marca\``);
        await queryRunner.query(`DROP TABLE \`veiculos\``);
        await queryRunner.query(`DROP TABLE \`modelo\``);
        await queryRunner.query(`DROP TABLE \`marca\``);
    }
}
exports.CreateVeiculosEntities1708978800000 = CreateVeiculosEntities1708978800000;
//# sourceMappingURL=1708978800000-CreateVeiculosEntities.js.map