import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express()
app.use(express.json());
app.use(express.static("."))

app.post("/register", async (req, res) => {
    const {nome, email, senha} = req.body;

    if(!nome || !email || !senha) {
        return res.status(400).send("Campos não preenchidos")
    }

    const db = await open({
        filename: "./banco.db",
        driver: sqlite3.Database
    });

    await db.run(
        `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY, 
        nome TEXT,
         email TEXT UNIQUE, 
        senha TEXT
        )
    `);

    const userExist = await db.get("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (userExist){
        return res.status(400).send("Email já cadastrado")
    }
    
    await db.run(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`, [
        nome,
        email,
        senha
    ]);

    res.send("Usuario cadastrado com sucesso!")
})

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));

// ========================================================================================= //
                                    // Rotas de login //

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send("Campos não preenchidos");
    }

    const db = await open({
        filename: "./banco.db",
        driver: sqlite3.Database
    });

    const user = await db.get("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (!user) {
        return res.status(400).send("Email não encontrado");
    }

    if (user.senha !== senha) {
        return res.status(400).send("Senha incorreta");
    }

    res.send(`Login bem-sucedido! Bem-vindo, ${user.nome}`);
});
