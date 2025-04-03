"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVersaoIdToVeiculos1743637609696 = void 0;
class AddVersaoIdToVeiculos1743637609696 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE veiculos ADD COLUMN versaoId INT NULL`);
        await queryRunner.query(`ALTER TABLE veiculos ADD CONSTRAINT FK_veiculos_versao FOREIGN KEY (versaoId) REFERENCES versao(id) ON DELETE SET NULL`);
        await queryRunner.query(`
            UPDATE veiculos v
            LEFT JOIN versao ver ON ver.nome_versao = v.versao AND ver.modeloId = v.modeloId
            SET v.versaoId = ver.id
            WHERE v.versao IS NOT NULL AND ver.id IS NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE veiculos DROP FOREIGN KEY FK_veiculos_versao`);
        await queryRunner.query(`ALTER TABLE veiculos DROP COLUMN versaoId`);
    }
}
exports.AddVersaoIdToVeiculos1743637609696 = AddVersaoIdToVeiculos1743637609696;
//# sourceMappingURL=1743637609696-AddVersaoIdToVeiculos.js.map