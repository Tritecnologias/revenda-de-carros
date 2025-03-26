"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVeiculoPintura1742594500000 = void 0;
class CreateVeiculoPintura1742594500000 {
    constructor() {
        this.name = 'CreateVeiculoPintura1742594500000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`pintura\` DROP COLUMN \`preco\``);
        await queryRunner.query(`ALTER TABLE \`pintura\` DROP FOREIGN KEY IF EXISTS \`FK_pintura_veiculo\``);
        await queryRunner.query(`ALTER TABLE \`pintura\` DROP COLUMN IF EXISTS \`veiculoId\``);
        await queryRunner.query(`
            CREATE TABLE \`veiculo_pintura\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`veiculoId\` int NOT NULL,
                \`pinturaId\` int NOT NULL,
                \`preco\` decimal(10,2) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
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
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`veiculo_pintura\` DROP FOREIGN KEY \`FK_veiculo_pintura_pintura\``);
        await queryRunner.query(`ALTER TABLE \`veiculo_pintura\` DROP FOREIGN KEY \`FK_veiculo_pintura_veiculo\``);
        await queryRunner.query(`DROP TABLE \`veiculo_pintura\``);
        await queryRunner.query(`ALTER TABLE \`pintura\` ADD COLUMN \`veiculoId\` int NULL`);
        await queryRunner.query(`
            ALTER TABLE \`pintura\` 
            ADD CONSTRAINT \`FK_pintura_veiculo\` 
            FOREIGN KEY (\`veiculoId\`) REFERENCES \`veiculo\`(\`id\`) 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`ALTER TABLE \`pintura\` ADD COLUMN \`preco\` decimal(10,2) NOT NULL`);
    }
}
exports.CreateVeiculoPintura1742594500000 = CreateVeiculoPintura1742594500000;
//# sourceMappingURL=1742594500000-CreateVeiculoPintura.js.map