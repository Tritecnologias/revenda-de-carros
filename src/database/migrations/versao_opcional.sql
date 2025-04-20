-- Criar tabela versao_opcional
CREATE TABLE IF NOT EXISTS versao_opcional (
    id INT AUTO_INCREMENT PRIMARY KEY,
    versao_id INT NOT NULL,
    opcional_id INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (versao_id) REFERENCES versao(id) ON DELETE CASCADE,
    FOREIGN KEY (opcional_id) REFERENCES opcionais(id) ON DELETE CASCADE,
    UNIQUE (versao_id, opcional_id)
);

-- Criar índices para melhorar a performance
CREATE INDEX idx_versao_opcional_versao_id ON versao_opcional(versao_id);
CREATE INDEX idx_versao_opcional_opcional_id ON versao_opcional(opcional_id);

-- MySQL não suporta comentários de tabela e coluna da mesma forma que o PostgreSQL
-- Os comentários abaixo são apenas para documentação
/*
Tabela versao_opcional: Tabela de associação entre versões de veículos e opcionais
Colunas:
- id: Identificador único da associação
- versao_id: Referência à versão do veículo
- opcional_id: Referência ao opcional
- preco: Preço do opcional para esta versão específica
- created_at: Data de criação do registro
- updated_at: Data da última atualização do registro
*/
