"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1709734325000 = void 0;
class InitialSchema1709734325000 {
    constructor() {
        this.name = 'InitialSchema1709734325000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE veiculo (
                id INT NOT NULL AUTO_INCREMENT,
                marca VARCHAR(255) NOT NULL,
                modelo VARCHAR(255) NOT NULL,
                versao VARCHAR(255) NOT NULL,
                precoPublico DECIMAL(10,2) NOT NULL,
                precoZonaFranca DECIMAL(10,2) NOT NULL,
                precoPcdIpi DECIMAL(10,2) NOT NULL,
                precoTaxiIpiIcms DECIMAL(10,2) NOT NULL,
                precoTaxiIpi DECIMAL(10,2) NOT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE pintura (
                id INT NOT NULL AUTO_INCREMENT,
                tipo VARCHAR(255) NOT NULL,
                nome VARCHAR(255) NOT NULL,
                preco DECIMAL(10,2) NOT NULL,
                veiculoId INT,
                PRIMARY KEY (id),
                FOREIGN KEY (veiculoId) REFERENCES veiculo(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            INSERT INTO veiculo (marca, modelo, versao, precoPublico, precoZonaFranca, precoPcdIpi, precoTaxiIpiIcms, precoTaxiIpi)
            VALUES 
            ('VOLKSWAGEN', 'VIRTUS', 'VIRTUS SENSE TSI 116CV (BZ4AK4-0)', 105990.00, 93695.15, 102176.21, 89915.07, 102176.21)
        `);
        const veiculoId = await queryRunner.query(`SELECT LAST_INSERT_ID() as id`);
        await queryRunner.query(`
            INSERT INTO pintura (tipo, nome, preco, veiculoId)
            VALUES 
            ('SÓLIDA', 'Preto Ninja', 0.00, ?),
            ('SÓLIDA', 'Branco Cristal', 900.00, ?),
            ('METÁLICA', 'Cinza Platinum', 1650.00, ?),
            ('METÁLICA', 'Azul Biscay', 1650.00, ?),
            ('METÁLICA', 'Prata Sirius', 1650.00, ?)
        `, [veiculoId[0].id, veiculoId[0].id, veiculoId[0].id, veiculoId[0].id, veiculoId[0].id]);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE pintura`);
        await queryRunner.query(`DROP TABLE veiculo`);
    }
}
exports.InitialSchema1709734325000 = InitialSchema1709734325000;
//# sourceMappingURL=1709734325000-InitialSchema.js.map