CREATE DATABASE pdv;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha TEXT NOT NULL
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL
);

INSERT INTO categorias (descricao) VALUES
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');


CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL UNIQUE,
    quantidade_estoque INT NOT NULL,
    valor INT NOT NULL,
    categoria_id INT,
    produto_imagem TEXT,
    estoque_reservado INT NOT NULL DEFAULT 0,
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
);


CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    cep VARCHAR(8) ,
    rua VARCHAR(100) ,
    numero INT ,
    bairro VARCHAR(50) ,
    cidade VARCHAR(50) ,
    estado VARCHAR(2)
);

CREATE TABLE pedidos (
	id SERIAL PRIMARY KEY,
  observacao VARCHAR(100),
  valor_total INT NOT NULL,
  cliente_id INT NOT NULL REFERENCES clientes (id)
);

CREATE TABLE pedido_produtos(
id SERIAL PRIMARY KEY,
pedido_id int not null REFERENCES pedidos (id),
produto_id int not null REFERENCES produtos (id),
quantidade_produto int not null,
valor_produto int not null
);

ALTER TABLE produtos
ADD estoque_reservado INT NOT NULL DEFAULT 0;