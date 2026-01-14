CREATE DATABASE portfolio_edu;

CREATE TABLE projetos (
    id_projeto INT PRIMARY KEY AUTO_INCREMENT,
    nome_projeto VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    categoria ENUM(
        'Web',
        'Mobile',
        'API'
    ) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL 
);

INSERT INTO `projetos`(`nome_projeto`, `descricao`, `categoria`, `data_inicio`, `data_fim`) 
VALUES ('HelpDeskCPA','teste','Web','2025/07/05','2025/12/01');

SELECT id_projeto, nome_projeto,
  DATE_FORMAT(data_inicio, '%Y-%m-%d') AS data_inicio,
  DATE_FORMAT(data_fim, '%d-%m-%Y') AS data_fim
FROM projetos;