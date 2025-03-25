import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVeiculoPintura1742594500000 implements MigrationInterface {
    name = 'CreateVeiculoPintura1742594500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remover a coluna preco da tabela pintura
        await queryRunner.query(`ALTER TABLE \`pintura\` DROP COLUMN \`preco\``);
        
        // Remover a chave estrangeira entre pintura e veiculo
        await queryRunner.query(`ALTER TABLE \`pintura\` DROP FOREIGN KEY IF EXISTS \`FK_pintura_veiculo\``);
        await queryRunner.query(`ALTER TABLE \`pintura\` DROP COLUMN IF EXISTS \`veiculoId\``);
        
        // Criar a tabela veiculo_pintura
        await queryRunner.query(`
            CREATE TABLE \`veiculo_pintura\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`veiculoId\` int NOT NULL,
                \`pinturaId\` int NOT NULL,
                \`preco\` decimal(10,2) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        
        // Adicionar chaves estrangeiras
        await queryRunner.query(`
            ALTER TABLE \`veiculo_pintura\` 
            ADD CONSTRAINT \`FK_veiculo_pintura_veiculo\` 
            FOREIGN KEY (\`veiculoId\`) REFERENCES \`veiculo\`(\`id\`) 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            ALTER TABLE \`veiculo_pintura\` 
            ADD CONSTRAINT \`FK_veiculo_pintura_pintura\` 
            FOREIGN KEY (\`pinturaId\`) REFERENCES \`pintura\`(\`id\`) 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover chaves estrangeiras
        await queryRunner.query(`ALTER TABLE \`veiculo_pintura\` DROP FOREIGN KEY \`FK_veiculo_pintura_pintura\``);
        await queryRunner.query(`ALTER TABLE \`veiculo_pintura\` DROP FOREIGN KEY \`FK_veiculo_pintura_veiculo\``);
        
        // Remover a tabela veiculo_pintura
        await queryRunner.query(`DROP TABLE \`veiculo_pintura\``);
        
        // Adicionar a coluna veiculoId de volta à tabela pintura
        await queryRunner.query(`ALTER TABLE \`pintura\` ADD COLUMN \`veiculoId\` int NULL`);
        
        // Adicionar a chave estrangeira de volta
        await queryRunner.query(`
            ALTER TABLE \`pintura\` 
            ADD CONSTRAINT \`FK_pintura_veiculo\` 
            FOREIGN KEY (\`veiculoId\`) REFERENCES \`veiculo\`(\`id\`) 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);
        
        // Adicionar a coluna preco de volta à tabela pintura
        await queryRunner.query(`ALTER TABLE \`pintura\` ADD COLUMN \`preco\` decimal(10,2) NOT NULL`);
    }
}
