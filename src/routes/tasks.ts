import express from 'express';
import prisma from '../../prisma/prisma';

const router = express.Router();

/**
 * @route   POST /api/tasks
 * @desc    Cria uma nova tarefa com lembrete opcional
 */
router.post('/tasks', async (req: any, res: any) => {
  try {
    const { name, type, description, date, isPriority, reminderTime } = req.body;
    const userId = req.user.id;

    const task = await prisma.task.create({
      data: {
        name,
        type, // Ex: 'HEALTH', 'WORK'
        description,
        isPriority: isPriority || false,
        date: new Date(date),
        userId,
        // Se houver um horário de lembrete, cria automaticamente o registro vinculado
        reminders: reminderTime ? {
          create: {
            time: new Date(reminderTime),
          }
        } : undefined,  
      },
      include: {
        reminders: true, // Retorna o lembrete junto no JSON
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: 'Erro ao criar tarefa', details: error.message });
  }
});

/**
 * @route   GET /api/tasks
 * @desc    Lista tarefas do usuário (com filtros opcionais)
 */
router.get('/tasks', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { type, priority } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        ...(type && { type: String(type) }),
        ...(priority && { isPriority: priority === 'true' }),
      },
      include: {
        reminders: true, // Inclui os lembretes para exibir o horário na lista
      },
      orderBy: { date: 'asc' },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao procurar tarefas' });
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Atualiza uma tarefa e seu status ou lembrete
 */
router.put('/tasks/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { name, status, description, date, isPriority, reminderTime } = req.body;
    const userId = req.user.id;

    const task = await prisma.task.update({
      where: { id, userId },
      data: {
        name,
        status, // boolean para marcar como concluído
        description,
        isPriority,
        date: date ? new Date(date) : undefined,
        // Atualiza ou cria o lembrete se o horário for enviado
        reminders: reminderTime ? {
          deleteMany: {}, // Limpa anteriores (se houver relação 1-N simples)
          create: { time: new Date(reminderTime) }
        } : undefined
      },
      include: { reminders: true }
    });

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar tarefa' });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Remove uma tarefa (o Prisma removerá o lembrete via Cascade)
 */
router.delete('/tasks/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.task.delete({
      where: { id, userId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao eliminar tarefa' });
  }
});

/**
 * @route   GET /api/tasks/stats
 * @desc    Retorna estatísticas (Tarefas pendentes vs concluídas)
 */
router.get('/stats/summary', async (req: any, res) => {
  try {
    const userId = req.user.id;

    const stats = await prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        id: true,
      },
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
});

export default router;