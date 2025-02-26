const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const db = require("./config/db");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = 5000;

app.use(express.static(path.join(__dirname, "public")));

// Rotas para cada página
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/ofertas", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "ofertas.html"));
});

app.get("/contato", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "contato.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/produtos", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "produtos.html"));
});

app.get("/produtoss", (req, res) => {
    db.query("SELECT * FROM produtos", (err, results) => {
        if (err) {
            console.error("Erro ao buscar produtos:", err);
            res.status(500).send("Erro no servidor");
            return;
        }

        const produtosCorrigidos = results.map(produto => ({
            ...produto,
            preco: Number(produto.preco)
        }));

        res.json(produtosCorrigidos);
    });
});


// Rota para cadastrar o usuário
app.post("/cadastrar", (req, res) => {
    const { email, senha } = req.body;

    // Verificar se todos os campos foram preenchidos
    if (!email || !senha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Verificar se o email já existe no banco de dados
    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Erro ao verificar email:", err);
            return res.status(500).json({ error: "Erro no servidor." });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: "Email já cadastrado." });
        }

        // Criptografar a senha antes de salvar
        bcrypt.hash(senha, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Erro ao criptografar a senha:", err);
                return res.status(500).json({ error: "Erro no servidor." });
            }

            // Inserir o usuário no banco de dados
            db.query("INSERT INTO usuarios (email, senha) VALUES (?, ?)", [email, hashedPassword], (err, result) => {
                if (err) {
                    console.error("Erro ao cadastrar usuário:", err);
                    return res.status(500).json({ error: "Erro no servidor." });
                }

                res.status(201).json({ message: "Usuário cadastrado com sucesso!" }); 
            });
        });
    });
});

// Rota para login
app.post("/logar", (req, res) => {
    const { email, senha } = req.body; // Dados do formulário de login

    // Verificar se o email e a senha foram preenchidos
    if (!email || !senha) {
        return res.status(400).send("Email e senha são obrigatórios.");
    }

    // Buscar o usuário no banco de dados
    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Erro ao buscar o usuário:", err);
            return res.status(500).send("Erro no servidor.");
        }

        if (results.length === 0) {
            return res.status(400).send("Usuário não encontrado.");
        }

        // Comparar a senha informada com a senha criptografada no banco de dados
        const usuario = results[0]; // Primeiro (e único) resultado da consulta
        bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
            if (err) {
                console.error("Erro ao comparar a senha:", err);
                return res.status(500).send("Erro no servidor.");
            }

            if (!isMatch) {
                res.status(400).json({ error: "Senha incorreta." });
            }

            // Caso a senha esteja correta, login bem-sucedido
            res.json({ message: "Login bem-sucedido!" });
        });
    });
});

// Rota para enviar o contato
app.post("/contatar", (req, res) => {
    const { nome, email, mensagem } = req.body;

    // Verificar se todos os campos foram preenchidos
    if (!nome || !email || !mensagem) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Inserir o usuário no banco de dados
    db.query("INSERT INTO contatos (nome, email, mensagem) VALUES (?, ?, ?)", [nome, email, mensagem], (err, result) => {
        if (err) {
            console.error("Erro ao salvar contato:", err);
            return res.status(500).json({ error: "Erro no servidor." });
        }

        res.status(201).json({ message: "Contato salvo com sucesso!" }); 
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});



