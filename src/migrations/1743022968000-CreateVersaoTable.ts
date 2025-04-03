import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVersaoTable1743022968000 implements MigrationInterface {
    name = 'CreateVersaoTable1743022968000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar a tabela versao
        await queryRunner.query(`
            CREATE TABLE \`versao\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`nome_versao\` varchar(255) NOT NULL,
                \`status\` varchar(255) NOT NULL DEFAULT 'ativo',
                \`modeloId\` int NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        // Adicionar chave estrangeira para a tabela modelo
        await queryRunner.query(`
            ALTER TABLE \`versao\` 
            ADD CONSTRAINT \`FK_versao_modelo\` 
            FOREIGN KEY (\`modeloId\`) 
            REFERENCES \`modelo\`(\`id\`) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover a chave estrangeira
        await queryRunner.query(`ALTER TABLE \`versao\` DROP FOREIGN KEY \`FK_versao_modelo\``);
        
        // Remover a tabela versao
        await queryRunner.query(`DROP TABLE \`versao\``);
    }
}
