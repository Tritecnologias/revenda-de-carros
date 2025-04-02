require('dotenv').config();
const mysql = require('mysql2/promise');

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
        
        // Verificar usuários existentes
        const [users] = await connection.execute('SELECT id, nome, email, role FROM users');
        
        console.log('Usuários no sistema:');
        users.forEach(user => {
            console.log(`ID: ${user.id}, Nome: ${user.nome}, Email: ${user.email}, Papel: ${user.role}`);
        });
        
        // Verificar se o usuário teste@gmail.com existe
        const [testUser] = await connection.execute('SELECT id, nome, email, role FROM users WHERE email = ?', ['teste@gmail.com']);
        
        if (testUser.length > 0) {
            console.log('\nUsuário teste@gmail.com encontrado:');
            console.log(`ID: ${testUser[0].id}, Nome: ${testUser[0].nome}, Email: ${testUser[0].email}, Papel: ${testUser[0].role}`);
            
            // Atualizar o papel para "user" se necessário
            if (testUser[0].role !== 'user') {
                console.log(`Atualizando papel de ${testUser[0].role} para "user"...`);
                await connection.execute('UPDATE users SET role = ? WHERE id = ?', ['user', testUser[0].id]);
                console.log('Papel atualizado com sucesso!');
            } else {
                console.log('O usuário já possui o papel "user". Nenhuma atualização necessária.');
            }
        } else {
            console.log('\nUsuário teste@gmail.com não encontrado no banco de dados.');
        }
        
        // Verificar usuário wanderson.martins.silva@gmail.com
        const [wandersonUser] = await connection.execute('SELECT id, nome, email, role FROM users WHERE email = ?', ['wanderson.martins.silva@gmail.com']);
        
        if (wandersonUser.length > 0) {
            console.log('\nUsuário wanderson.martins.silva@gmail.com encontrado:');
            console.log(`ID: ${wandersonUser[0].id}, Nome: ${wandersonUser[0].nome}, Email: ${wandersonUser[0].email}, Papel: ${wandersonUser[0].role}`);
            
            // Atualizar o papel para "user" se necessário
            if (wandersonUser[0].role !== 'user') {
                console.log(`Atualizando papel de ${wandersonUser[0].role} para "user"...`);
                await connection.execute('UPDATE users SET role = ? WHERE id = ?', ['user', wandersonUser[0].id]);
                console.log('Papel atualizado com sucesso!');
            } else {
                console.log('O usuário já possui o papel "user". Nenhuma atualização necessária.');
            }
        } else {
            console.log('\nUsuário wanderson.martins.silva@gmail.com não encontrado no banco de dados.');
        }
        
        // Criar um usuário de teste com papel "cadastrador" para verificar o controle de acesso
        const [cadastradorUser] = await connection.execute('SELECT id, nome, email, role FROM users WHERE email = ?', ['cadastrador@teste.com']);
        
        if (cadastradorUser.length === 0) {
            console.log('\nCriando usuário de teste com papel "cadastrador"...');
            // Gerar hash da senha "123456" (deve ser compatível com o método usado na aplicação)
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('123456', 10);
            
            await connection.execute(
                'INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)',
                ['Usuário Cadastrador', 'cadastrador@teste.com', hashedPassword, 'cadastrador']
            );
            console.log('Usuário cadastrador criado com sucesso!');
        } else {
            console.log('\nUsuário cadastrador@teste.com já existe:');
            console.log(`ID: ${cadastradorUser[0].id}, Nome: ${cadastradorUser[0].nome}, Email: ${cadastradorUser[0].email}, Papel: ${cadastradorUser[0].role}`);
            
            // Garantir que o papel seja "cadastrador"
            if (cadastradorUser[0].role !== 'cadastrador') {
                console.log(`Atualizando papel de ${cadastradorUser[0].role} para "cadastrador"...`);
                await connection.execute('UPDATE users SET role = ? WHERE id = ?', ['cadastrador', cadastradorUser[0].id]);
                console.log('Papel atualizado com sucesso!');
            }
        }
        
        console.log('\nVerificação e atualização de usuários concluída!');
        console.log('\nInstruções para teste:');
        console.log('1. Faça login com o usuário teste@gmail.com ou wanderson.martins.silva@gmail.com (papel: user)');
        console.log('   - O menu VEÍCULOS NÃO deve ser exibido');
        console.log('2. Faça login com o usuário cadastrador@teste.com (senha: 123456, papel: cadastrador)');
        console.log('   - O menu VEÍCULOS DEVE ser exibido');
        
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await connection.end();
        console.log('Conexão com o banco de dados encerrada');
    }
}

main();
