"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVendasDiretasTable1711307721000 = void 0;
const typeorm_1 = require("typeorm");
class CreateVendasDiretasTable1711307721000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "vendas_diretas",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "nome",
                    type: "varchar",
                    length: "100",
                    isNullable: false
                },
                {
                    name: "percentual",
                    type: "decimal",
                    precision: 5,
                    scale: 2,
                    isNullable: false
                },
                {
                    name: "marcaId",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "status",
                    type: "varchar",
                    length: "20",
                    default: "'ativo'"
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }));
        await queryRunner.createForeignKey("vendas_diretas", new typeorm_1.TableForeignKey({
            columnNames: ["marcaId"],
            referencedColumnNames: ["id"],
            referencedTableName: "marca",
            onDelete: "SET NULL"
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable("vendas_diretas");
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("marcaId") !== -1);
        await queryRunner.dropForeignKey("vendas_diretas", foreignKey);
        await queryRunner.dropTable("vendas_diretas");
    }
}
exports.CreateVendasDiretasTable1711307721000 = CreateVendasDiretasTable1711307721000;
//# sourceMappingURL=1711307721000-CreateVendasDiretasTable.js.map