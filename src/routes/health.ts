import express from 'express';
import prisma from '../../prisma/prisma';

const router = express.Router();

/**
 * @route   POST /api/health
 * @desc    Cria um novo registro de saúde
 */
router.post('/health', async (req: any, res: any) => {
  try {
    const { title, note, date, category } = req.body;
    const userId = req.user.id;

    const healthRecord = await prisma.health.create({
      data: {
        title,
        note,
        category,
        date: date ? new Date(date) : new Date(),
        userId,
      },
    });

    res.status(201).json(healthRecord);
  } catch (error: any) {
    res.status(400).json({ error: 'Erro ao registrar dados de saúde', details: error.message });
  }
});

/**
 * @route   GET /api/health
 * @desc    Lista todos os registros de saúde do usuário
 */
router.get('/health', async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const records = await prisma.health.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao procurar registros de saúde' });
  }
});

/**
 * @route   PUT /api/health/:id
 * @desc    Atualiza um registro de saúde existente
 */
router.put('/health/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, note, date, category } = req.body;
    const userId = req.user.id;

    const updatedRecord = await prisma.health.update({
      where: { 
        id, 
        userId // Garante segurança para o usuário editar apenas o seu próprio registro
      },
      data: {
        title,
        note,
        category,
        date: date ? new Date(date) : undefined,
      },
    });

    res.json(updatedRecord);
  } catch (error: any) {
    res.status(400).json({ error: 'Erro ao atualizar registro de saúde' });
  }
});

/**
 * @route   DELETE /api/health/:id
 * @desc    Remove um registro de saúde
 */
router.delete('/health/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.health.delete({
      where: { id, userId },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: 'Erro ao eliminar registro de saúde' });
  }
});


export default router;