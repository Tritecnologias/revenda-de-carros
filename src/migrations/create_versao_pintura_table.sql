CREATE TABLE IF NOT EXISTS versao_pintura (
    id INT AUTO_INCREMENT PRIMARY KEY,
    versaoId INT NOT NULL,
    pinturaId INT NOT NULL,
    preco DECIMAL(10,2) DEFAULT 0,
    CONSTRAINT fk_versao_pintura_versao FOREIGN KEY (versaoId) REFERENCES versao(id) ON DELETE CASCADE,
    CONSTRAINT fk_versao_pintura_pintura FOREIGN KEY (pinturaId) REFERENCES pintura(id) ON DELETE CASCADE
);
