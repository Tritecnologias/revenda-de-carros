"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameVeiculoPinturaToModeloPintura1742594600000 = void 0;
class RenameVeiculoPinturaToModeloPintura1742594600000 {
    constructor() {
        this.name = 'RenameVeiculoPinturaToModeloPintura1742594600000';
    }
    async up(queryRunner) {
        await queryRunner.query(`RENAME TABLE \`veiculo_pintura\` TO \`modelo_pintura\``);
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` CHANGE COLUMN \`veiculoId\` \`modeloId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` ADD CONSTRAINT \`FK_modelo_pintura_modelo\` FOREIGN KEY (\`modeloId\`) REFERENCES \`modelo\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` ADD CONSTRAINT \`FK_modelo_pintura_pintura\` FOREIGN KEY (\`pinturaId\`) REFERENCES \`pintura\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` DROP FOREIGN KEY \`FK_modelo_pintura_modelo\``);
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` DROP FOREIGN KEY \`FK_modelo_pintura_pintura\``);
        await queryRunner.query(`ALTER TABLE \`modelo_pintura\` CHANGE COLUMN \`modeloId\` \`veiculoId\` int NOT NULL`);
        await queryRunner.query(`RENAME TABLE \`modelo_pintura\` TO \`veiculo_pintura\``);
    }
}
exports.RenameVeiculoPinturaToModeloPintura1742594600000 = RenameVeiculoPinturaToModeloPintura1742594600000;
//# sourceMappingURL=1742594600000-RenameVeiculoPinturaToModeloPintura.js.map