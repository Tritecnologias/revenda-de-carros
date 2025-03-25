import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVeiculosEntities1708978800000 implements MigrationInterface {
    name = 'CreateVeiculosEntities1708978800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar tabela marca
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

        // Criar tabela modelo
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

        // Criar tabela veiculos
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

        // Adicionar chaves estrangeiras
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover chaves estrangeiras
        await queryRunner.query(`ALTER TABLE \`veiculos\` DROP FOREIGN KEY \`FK_veiculos_modelo\``);
        await queryRunner.query(`ALTER TABLE \`veiculos\` DROP FOREIGN KEY \`FK_veiculos_marca\``);
        await queryRunner.query(`ALTER TABLE \`modelo\` DROP FOREIGN KEY \`FK_modelo_marca\``);

        // Remover tabelas
        await queryRunner.query(`DROP TABLE \`veiculos\``);
        await queryRunner.query(`DROP TABLE \`modelo\``);
        await queryRunner.query(`DROP TABLE \`marca\``);
    }
}
