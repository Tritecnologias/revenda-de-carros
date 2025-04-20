"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();
async function checkDatabaseConnection() {
    console.log('Verificando conexão com o banco de dados...');
    console.log('Configurações:');
    console.log(`Host: ${process.env.DATABASE_HOST || '127.0.0.1'}`);
    console.log(`Porta: ${process.env.DATABASE_PORT || '3306'}`);
    console.log(`Usuário: ${process.env.DATABASE_USER || 'wanderson'}`);
    console.log(`Banco: ${process.env.DATABASE_NAME || 'revenda_carros'}`);
    try {
        const connection = await (0, typeorm_1.createConnection)({
            type: 'mysql',
            host: process.env.DATABASE_HOST || '127.0.0.1',
            port: parseInt(process.env.DATABASE_PORT) || 3306,
            username: process.env.DATABASE_USER || 'wanderson',
            password: process.env.DATABASE_PASSWORD || 'Flavinha@2022',
            database: process.env.DATABASE_NAME || 'revenda_carros',
        });
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        const veiculosExist = await connection.query('SHOW TABLES LIKE "veiculos"');
        if (veiculosExist.length > 0) {
            console.log('Tabela de veículos encontrada.');
            const [{ count }] = await connection.query('SELECT COUNT(*) as count FROM veiculos');
            console.log(`Total de veículos no banco: ${count}`);
            console.log('Estrutura da tabela de veículos:');
            const columns = await connection.query('SHOW COLUMNS FROM veiculos');
            columns.forEach(column => {
                console.log(`- ${column.Field}: ${column.Type} (${column.Null === 'YES' ? 'Nullable' : 'Not Nullable'})`);
            });
        }
        else {
            console.error('Tabela de veículos não encontrada!');
        }
        await connection.close();
    }
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:');
        console.error(error);
    }
}
checkDatabaseConnection()
    .then(() => console.log('Verificação concluída.'))
    .catch(error => console.error('Erro durante a verificação:', error));
//# sourceMappingURL=database-check.js.map