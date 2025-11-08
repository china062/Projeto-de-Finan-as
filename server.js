import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// =================== MIDDLEWARES =====================
app.use(express.json());
app.use(express.static("."));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// =================== FUNÇÃO BANCO =====================
async function openDb() {
  return open({
    filename: "./banco.db",
    driver: sqlite3.Database,
  });
}

// ================= CRIAÇÃO DAS TABELAS ====================
(async () => {
  const db = await openDb();
  await db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS transacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      valor REAL NOT NULL,
      descricao TEXT NOT NULL,
      data TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES usuarios(id)
    )
  `);
})();

// ========================== REGISTRO ==========================
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  try {
    const db = await openDb();

    const existente = await db.get("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existente) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    await db.run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [
      nome,
      email,
      senha,
    ]);

    res.json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// ========================== LOGIN ==========================
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  try {
    const db = await openDb();
    const user = await db.get(
      "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (!user) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    res.cookie("userId", user.id, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
      path: "/",
    });

    res.json({
      message: `Login bem-sucedido! Bem-vindo, ${user.nome}`,
      userId: user.id,
      nome: user.nome,
      email: user.email,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// =================== ROTA PARA REGISTRAR TRANSAÇÃO =========================
app.post("/transacoes", async (req, res) => {
  const userId = req.cookies?.userId;
  const { tipo, valor, descricao } = req.body;

  console.log("Cookie userId recebido:", userId);

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  if (!tipo || !valor) {
    return res.status(400).json({ error: "Campos obrigatórios faltando." });
  }

  try {
    const db = await openDb();
    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0)
      return res.status(400).json({ error: "Valor inválido." });

    await db.run(
      `INSERT INTO transacoes (
        user_id, tipo, valor, descricao, data
      ) VALUES (?, ?, ?, ?, datetime('now'))`,
      [userId, tipo, valor, descricao || ""]
    );

    res.json({ message: "Transação registrada com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar transação:", err);
    res.status(500).json({ error: "Erro ao registrar transação." });
  }
});

// =================== ROTA PARA LISTAR TRANSAÇÕES DO USUÁRIO =========================
app.get("/transacoes", async (req, res) => {
  const userId = req.cookies?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  try {
    const db = await openDb();
    const transacoes = await db.all(
      "SELECT * FROM transacoes WHERE user_id = ? ORDER BY data DESC",
      [userId]
    );
    res.json(transacoes);
  } catch (err) {
    console.error("Erro ao buscar transações:", err);
    res.status(500).json({ error: "Erro ao buscar transações." });
  }
});

// ========================== SERVIDOR ==========================
app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
