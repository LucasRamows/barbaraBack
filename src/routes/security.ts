import express from "express";
import prisma from "../../prisma/prisma";

const router = express.Router();

/**
 * @route   POST /api/security/credentials
 * @desc    Guarda uma nova credencial criptografada no cofre
 */
router.post("/credentials", async (req: any, res: any) => {
  try {
    const { site, email, password } = req.body;
    const userId = req.user.id;

    if (!site || !email || !password) {
      return res.status(400).json({ error: "Campos obrigatórios em falta" });
    }

    const credential = await prisma.security.create({
      data: {
        site,
        email,
        password, // Esta string já deve vir criptografada do Frontend (RSA)
        userId,
      },
    });

    res.status(201).json(credential);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Erro ao registar credencial", details: error.message });
  }
});

/*
 * @route   POST /api/security/credentials
 * @desc    Guarda uma nova chave publica
 */
router.put("/publickey", async (req:any, res:any) => {
  try {
    const { key } = req.body;
    const userId:string = req.user.id;

    const settings = await prisma.settings.update({
      where: {
        userId:userId
      },
      data: {
        publicKey: key,
      },
    });

    return res.status(200).json(settings);
  } catch (error: any) {
    return res.status(400).json({
      error: "Erro ao registrar key",
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/security/credentials
 * @desc    Lista todas as credenciais criptografadas do utilizador
 */
router.get("/publickey", async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const key = await prisma.settings.findMany({
      where: { userId },
    });
    res.json(key);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao procurar key" });
  }
});

/**
 * @route   GET /api/security/credentials
 * @desc    Lista todas as credenciais criptografadas do utilizador
 */
router.get("/credentials", async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const credentials = await prisma.security.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(credentials);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao procurar credenciais" });
  }
});

/**
 * @route   PUT /api/security/credentials/:id
 * @desc    Atualiza uma credencial existente
 */
router.put("/credentials/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { site, email, password } = req.body;
    const userId = req.user.id;

    const credential = await prisma.security.update({
      where: {
        id,
        userId, // Garante que o utilizador só edita o que lhe pertence
      },
      data: {
        site,
        email,
        password, // Deve ser a nova string criptografada
      },
    });

    res.json(credential);
  } catch (error: any) {
    res.status(400).json({ error: "Erro ao atualizar credencial" });
  }
});

/**
 * @route   DELETE /api/security/credentials/:id
 * @desc    Remove uma credencial do cofre
 */
router.delete("/credentials/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.security.delete({
      where: {
        id,
        userId,
      },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: "Erro ao eliminar credencial" });
  }
});

/**
 * @route   GET /api/security/stats
 * @desc    Retorna estatísticas simples do cofre (ex: contagem)
 */
router.get("/stats", async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const count = await prisma.security.count({
      where: { userId },
    });

    res.json({ totalCredentials: count });
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao obter estatísticas" });
  }
});

export default router;
