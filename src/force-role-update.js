require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function main() {
    // Conectar ao banco de dados
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    try {
        console.log('Conectado ao banco de dados MySQL');
        
        // 1. Verificar e atualizar o papel do usuário wanderson.martins.silva@gmail.com
        const [wandersonUser] = await connection.execute(
            'SELECT id, nome, email, role FROM users WHERE email = ?', 
            ['wanderson.martins.silva@gmail.com']
        );
        
        if (wandersonUser.length > 0) {
            console.log('Usuário wanderson.martins.silva@gmail.com encontrado:');
            console.log(`ID: ${wandersonUser[0].id}, Nome: ${wandersonUser[0].nome}, Email: ${wandersonUser[0].email}, Papel: ${wandersonUser[0].role}`);
            
            // Forçar a atualização do papel para "user"
            console.log('Forçando atualização do papel para "user"...');
            await connection.execute(
                'UPDATE users SET role = ? WHERE id = ?', 
                ['user', wandersonUser[0].id]
            );
            console.log('Papel atualizado com sucesso!');
        } else {
            console.log('Usuário wanderson.martins.silva@gmail.com não encontrado no banco de dados.');
        }
        
        // 2. Verificar e atualizar o papel do usuário teste@gmail.com
        const [testeUser] = await connection.execute(
            'SELECT id, nome, email, role FROM users WHERE email = ?', 
            ['teste@gmail.com']
        );
        
        if (testeUser.length > 0) {
            console.log('\nUsuário teste@gmail.com encontrado:');
            console.log(`ID: ${testeUser[0].id}, Nome: ${testeUser[0].nome}, Email: ${testeUser[0].email}, Papel: ${testeUser[0].role}`);
            
            // Forçar a atualização do papel para "user"
            console.log('Forçando atualização do papel para "user"...');
            await connection.execute(
                'UPDATE users SET role = ? WHERE id = ?', 
                ['user', testeUser[0].id]
            );
            console.log('Papel atualizado com sucesso!');
        } else {
            console.log('\nUsuário teste@gmail.com não encontrado no banco de dados.');
            
            // Criar o usuário teste@gmail.com com papel "user"
            console.log('Criando usuário teste@gmail.com com papel "user"...');
            const hashedPassword = await bcrypt.hash('123456', 10);
            await connection.execute(
                'INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)',
                ['Usuário de Teste', 'teste@gmail.com', hashedPassword, 'user']
            );
            console.log('Usuário teste@gmail.com criado com sucesso!');
        }
        
        // 3. Verificar e atualizar o papel do usuário cadastrador@teste.com
        const [cadastradorUser] = await connection.execute(
            'SELECT id, nome, email, role FROM users WHERE email = ?', 
            ['cadastrador@teste.com']
        );
        
        if (cadastradorUser.length > 0) {
            console.log('\nUsuário cadastrador@teste.com encontrado:');
            console.log(`ID: ${cadastradorUser[0].id}, Nome: ${cadastradorUser[0].nome}, Email: ${cadastradorUser[0].email}, Papel: ${cadastradorUser[0].role}`);
            
            // Forçar a atualização do papel para "cadastrador"
            console.log('Forçando atualização do papel para "cadastrador"...');
            await connection.execute(
                'UPDATE users SET role = ? WHERE id = ?', 
                ['cadastrador', cadastradorUser[0].id]
            );
            console.log('Papel atualizado com sucesso!');
        } else {
            console.log('\nUsuário cadastrador@teste.com não encontrado no banco de dados.');
            
            // Criar o usuário cadastrador@teste.com com papel "cadastrador"
            console.log('Criando usuário cadastrador@teste.com com papel "cadastrador"...');
            const hashedPassword = await bcrypt.hash('123456', 10);
            await connection.execute(
                'INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)',
                ['Usuário Cadastrador', 'cadastrador@teste.com', hashedPassword, 'cadastrador']
            );
            console.log('Usuário cadastrador@teste.com criado com sucesso!');
        }
        
        // 4. Verificar todos os usuários no sistema
        console.log('\nVerificando todos os usuários no sistema após as atualizações:');
        const [allUsers] = await connection.execute('SELECT id, nome, email, role FROM users');
        allUsers.forEach(user => {
            console.log(`ID: ${user.id}, Nome: ${user.nome}, Email: ${user.email}, Papel: ${user.role}`);
        });
        
        console.log('\nProcesso de atualização de papéis concluído com sucesso!');
        console.log('\nInstruções para teste:');
        console.log('1. Limpe o cache do seu navegador (Ctrl+F5)');
        console.log('2. Faça login com o usuário teste@gmail.com ou wanderson.martins.silva@gmail.com (senha: 123456)');
        console.log('   - O menu VEÍCULOS NÃO deve ser exibido');
        console.log('3. Faça login com o usuário cadastrador@teste.com (senha: 123456)');
        console.log('   - O menu VEÍCULOS DEVE ser exibido');
        
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await connection.end();
        console.log('Conexão com o banco de dados encerrada');
    }
}

main();
