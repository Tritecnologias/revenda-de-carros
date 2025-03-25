import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateVendasDiretasTable1711307721000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
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
            })
        );

        // Adicionar chave estrangeira para a tabela de marcas
        await queryRunner.createForeignKey(
            "vendas_diretas",
            new TableForeignKey({
                columnNames: ["marcaId"],
                referencedColumnNames: ["id"],
                referencedTableName: "marca",
                onDelete: "SET NULL"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover a chave estrangeira primeiro
        const table = await queryRunner.getTable("vendas_diretas");
        const foreignKey = table.foreignKeys.find(
            fk => fk.columnNames.indexOf("marcaId") !== -1
        );
        await queryRunner.dropForeignKey("vendas_diretas", foreignKey);

        // Remover a tabela
        await queryRunner.dropTable("vendas_diretas");
    }
}
