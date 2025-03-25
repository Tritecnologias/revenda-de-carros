import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameVeiculoPinturaToModeloPintura1742594600000 implements MigrationInterface {
    name = 'RenameVeiculoPinturaToModeloPintura1742594600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Renomear a tabela veiculo_pintura para modelo_pintura
        await queryRunner.query(`RENAME TABLE \`veiculo_pintura\` TO \`modelo_pintura\``);
        
        // Renomear a coluna veiculoId para modeloId
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` CHANGE COLUMN \`veiculoId\` \`modeloId\` int NOT NULL`);
        
        // Adicionar chave estrangeira para a tabela modelo
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` ADD CONSTRAINT \`FK_modelo_pintura_modelo\` FOREIGN KEY (\`modeloId\`) REFERENCES \`modelo\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        
        // Adicionar chave estrangeira para a tabela pintura
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` ADD CONSTRAINT \`FK_modelo_pintura_pintura\` FOREIGN KEY (\`pinturaId\`) REFERENCES \`pintura\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover as chaves estrangeiras
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` DROP FOREIGN KEY \`FK_modelo_pintura_modelo\``);
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` DROP FOREIGN KEY \`FK_modelo_pintura_pintura\``);
        
        // Renomear a coluna modeloId para veiculoId
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` CHANGE COLUMN \`modeloId\` \`veiculoId\` int NOT NULL`);
        
        // Renomear a tabela modelo_pintura para veiculo_pintura
        await queryRunner.query(`RENAME TABLE \`modelo_pintura\` TO \`veiculo_pintura\``);
    }
}
