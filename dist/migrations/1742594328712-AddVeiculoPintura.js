"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVeiculoPintura1742594328712 = void 0;
class AddVeiculoPintura1742594328712 {
    constructor() {
        this.name = 'AddVeiculoPintura1742594328712';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`pintura\` DROP FOREIGN KEY \`FK_c54af6eb5190690e576d1de88af\``);
        await queryRunner.query(`CREATE TABLE \`veiculo_pintura\` (\`id\` int NOT NULL AUTO_INCREMENT, \`veiculoId\` int NOT NULL, \`pinturaId\` int NOT NULL, \`preco\` decimal(10,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`veiculo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`marca\` varchar(255) NOT NULL, \`modelo\` varchar(255) NOT NULL, \`versao\` varchar(255) NOT NULL, \`precoPublico\` decimal(10,2) NOT NULL, \`precoZonaFranca\` decimal(10,2) NOT NULL, \`precoPcdIpi\` decimal(10,2) NOT NULL, \`precoTaxiIpiIcms\` decimal(10,2) NOT NULL, \`precoTaxiIpi\` decimal(10,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pintura\` DROP COLUMN \`preco\``);
        await queryRunner.query(`ALTER TABLE \`pintura\` DROP COLUMN \`veiculoId\``);
        await queryRunner.query(`ALTER TABLE \`veiculo_pintura\` ADD CONSTRAINT \`FK_26a70f0356644df22590828fc76\` FOREIGN KEY (\`veiculoId\`) REFERENCES \`veiculo\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`veiculo_pintura\` ADD CONSTRAINT \`FK_d17a4214fc8bae8cb4f4dea1da6\` FOREIGN KEY (\`pinturaId\`) REFERENCES \`pintura\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`veiculo_pintura\` DROP FOREIGN KEY \`FK_d17a4214fc8bae8cb4f4dea1da6\``);
        await queryRunner.query(`ALTER TABLE \`veiculo_pintura\` DROP FOREIGN KEY \`FK_26a70f0356644df22590828fc76\``);
        await queryRunner.query(`ALTER TABLE \`pintura\` ADD \`veiculoId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`pintura\` ADD \`preco\` decimal NOT NULL`);
        await queryRunner.query(`DROP TABLE \`veiculo\``);
        await queryRunner.query(`DROP TABLE \`veiculo_pintura\``);
        await queryRunner.query(`ALTER TABLE \`pintura\` ADD CONSTRAINT \`FK_c54af6eb5190690e576d1de88af\` FOREIGN KEY (\`veiculoId\`) REFERENCES \`veiculo\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.AddVeiculoPintura1742594328712 = AddVeiculoPintura1742594328712;
//# sourceMappingURL=1742594328712-AddVeiculoPintura.js.map