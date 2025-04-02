require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  // Criar conexão com o banco de dados
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'wanderson',
    password: process.env.DB_PASSWORD || 'Flavinha@2022',
    database: process.env.DB_DATABASE || 'revenda_carros'
  });

  try {
    // Verificar o papel atual do usuário
    const [rows] = await connection.execute(
      'SELECT id, email, nome, role FROM users WHERE email = ?',
      ['wanderson.martins.silva@gmail.com']
    );

    if (rows.length === 0) {
      console.log('Usuário não encontrado!');
      return;
    }

    const user = rows[0];
    console.log('Usuário encontrado:');
    console.log(`ID: ${user.id}`);
    console.log(`Nome: ${user.nome}`);
    console.log(`Email: ${user.email}`);
    console.log(`Papel atual: ${user.role}`);

    // Atualizar o papel para 'user'
    if (user.role !== 'user') {
      console.log('\nAtualizando papel para "user"...');
      await connection.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        ['user', user.id]
      );
      console.log('Papel atualizado com sucesso!');
    } else {
      console.log('\nO usuário já possui o papel "user". Nenhuma atualização necessária.');
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await connection.end();
  }
}

main();
