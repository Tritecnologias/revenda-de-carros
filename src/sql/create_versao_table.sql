CREATE TABLE IF NOT EXISTS `versao` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome_versao` varchar(255) NOT NULL,
    `status` varchar(255) NOT NULL DEFAULT 'ativo',
    `modeloId` int NOT NULL,
    `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_versao_modelo` FOREIGN KEY (`modeloId`) REFERENCES `modelo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
