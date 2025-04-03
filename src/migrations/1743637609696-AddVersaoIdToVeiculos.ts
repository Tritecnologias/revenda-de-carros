import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVersaoIdToVeiculos1743637609696 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar coluna versaoId
        await queryRunner.query(`ALTER TABLE veiculos ADD COLUMN versaoId INT NULL`);
        
        // Adicionar chave estrangeira
        await queryRunner.query(`ALTER TABLE veiculos ADD CONSTRAINT FK_veiculos_versao FOREIGN KEY (versaoId) REFERENCES versao(id) ON DELETE SET NULL`);
        
        // Atualizar dados existentes (opcional)
        // Isso é apenas um exemplo de como você poderia migrar dados existentes
        // Você pode precisar adaptar isso com base nos seus dados reais
        await queryRunner.query(`
            UPDATE veiculos v
            LEFT JOIN versao ver ON ver.nome_versao = v.versao AND ver.modeloId = v.modeloId
            SET v.versaoId = ver.id
            WHERE v.versao IS NOT NULL AND ver.id IS NOT NULL
        `);
        
        // Remover a coluna versao antiga (opcional - você pode querer manter por um tempo)
        // await queryRunner.query(`ALTER TABLE veiculos DROP COLUMN versao`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Adicionar coluna versao de volta (se você a removeu)
        // await queryRunner.query(`ALTER TABLE veiculos ADD COLUMN versao VARCHAR(255)`);
        
        // Restaurar dados (opcional)
        // await queryRunner.query(`
        //     UPDATE veiculos v
        //     LEFT JOIN versao ver ON ver.id = v.versaoId
        //     SET v.versao = ver.nome_versao
        //     WHERE v.versaoId IS NOT NULL
        // `);
        
        // Remover chave estrangeira
        await queryRunner.query(`ALTER TABLE veiculos DROP FOREIGN KEY FK_veiculos_versao`);
        
        // Remover coluna versaoId
        await queryRunner.query(`ALTER TABLE veiculos DROP COLUMN versaoId`);
    }
}
