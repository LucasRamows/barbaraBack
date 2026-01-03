import express from 'express';
import prisma from '../../prisma/prisma';

const router = express.Router();

/**
 * @route   GET /api/private/auth/me
 * @desc    Retorna os dados do usuário autenticado pelo Token
 * @access  Private (Requer middleware de autenticação)
 */
router.get('/me', async (req: any, res: any) => {
  try {
    // O userId deve ser injetado no 'req' pelo seu middleware de JWT
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true, // Se você tiver roles no schema
        createdAt: true,
        // Não selecionamos o 'password' por segurança
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Erro ao buscar dados do perfil',
      details: error.message 
    });
  }
});

/**
 * @route   PUT /api/private/auth/update
 * @desc    Atualiza nome e/ou senha do usuário
 */
router.put('/update', async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    
    // Se houver senha, você deve hashear antes de salvar
    if (password) {
      // const hashedPassword = await bcrypt.hash(password, 10);
      // updateData.password = hashedPassword;
      updateData.password = password; // Lembre-se de criptografar aqui!
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    res.json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ error: 'Erro ao atualizar perfil' });
  }
});

export default router;