import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from '../../prisma/prisma';


const router = Router();
const SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

/**
 * POST /auth/register
 * Cria um novo usuário com hash de senha no campo 'key'
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, birthDay, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Nome, email e senha são obrigatórios.",
      });
    }

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone: phone || undefined },
        ],
      },
    });

    if (userExists) {
      return res.status(400).json({
        error: "Email ou telefone já cadastrados.",
      });
    }

    const hashedKey = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        birthDay,
        phone,
        role: role || "USER",
        key: hashedKey,

        // 👇 cria settings automaticamente
        settings: {
          create: {
            publicKey: "",
            notifyCalendar:true
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: newUser,
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({
      error: "Erro interno ao processar o cadastro.",
    });
  }
});


/**
 * POST /auth/login
 * Autentica o usuário e retorna um JWT
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.key) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }

    const isMatch = await bcrypt.compare(password, user.key);
    if (!isMatch) {
      return res.status(400).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      SECRET_KEY, 
    );

    res.json({ 
      token, 
      user: { 
        id: user.id,
        name: user.name, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

export default router;