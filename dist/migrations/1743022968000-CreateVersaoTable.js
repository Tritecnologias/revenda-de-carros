"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVersaoTable1743022968000 = void 0;
class CreateVersaoTable1743022968000 {
    constructor() {
        this.name = 'CreateVersaoTable1743022968000';
    }
    async up(queryRunner) {
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
        await queryRunner.query(`
            ALTER TABLE \`versao\` 
            ADD CONSTRAINT \`FK_versao_modelo\` 
            FOREIGN KEY (\`modeloId\`) 
            REFERENCES \`modelo\`(\`id\`) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`versao\` DROP FOREIGN KEY \`FK_versao_modelo\``);
        await queryRunner.query(`DROP TABLE \`versao\``);
    }
}
exports.CreateVersaoTable1743022968000 = CreateVersaoTable1743022968000;
//# sourceMappingURL=1743022968000-CreateVersaoTable.js.map