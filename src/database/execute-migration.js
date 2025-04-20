const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function executeMigration() {
  // Configuração da conexão com o banco de dados
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'revenda_carros',
    multipleStatements: true // Importante para executar múltiplas queries
  });

  try {
    console.log('Conectado ao banco de dados');
    
    // Ler o arquivo SQL
    const sqlFilePath = path.join(__dirname, 'migrations', 'versao_opcional.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Arquivo SQL lido com sucesso');
    console.log('Executando script SQL...');
    
    // Executar o script SQL
    const [results] = await connection.query(sqlContent);
    
    console.log('Script SQL executado com sucesso!');
    console.log('Resultados:', results);
    
  } catch (error) {
    console.error('Erro ao executar a migração:', error);
  } finally {
    // Fechar a conexão
    await connection.end();
    console.log('Conexão com o banco de dados fechada');
  }
}

// Executar a função
executeMigration();
