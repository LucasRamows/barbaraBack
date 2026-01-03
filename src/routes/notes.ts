import express from 'express';
import prisma from '../../prisma/prisma';

const router = express.Router();

/**
 * @route   POST /api/notes
 * @desc    Cria uma nota (Ideia/Projeto)
 */
router.post('/notes', async (req: any, res: any) => {
  try {
    const { title, content, folder } = req.body;
    const userId = req.user.id;

    const note = await prisma.note.create({
      data: {
        title: title || 'Sem título',
        content,
        folder: folder || 'Geral',
        userId,
      },
    });
    res.status(201).json(note);
  } catch (error: any) {
    res.status(400).json({ error: 'Erro ao criar nota' });
  }
});

/**
 * @route   GET /api/notes
 * @desc    Busca notas com filtro opcional por pasta
 */
router.get('/notes', async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { folder } = req.query;

    const notes = await prisma.note.findMany({
      where: { 
        userId,
        ...(folder ? { folder: String(folder) } : {})
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notas' });
  }
});

/**
 * @route   PUT /api/notes/:id
 * @desc    Atualiza título, conteúdo ou pasta da nota
 */
router.put('/notes/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, content, folder } = req.body;

    const note = await prisma.note.update({
      where: { id },
      data: { title, content, folder },
    });
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao salvar nota' });
  }
});

/**
 * @route   DELETE /api/notes/:id
 */
router.delete('/notes/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.note.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir nota' });
  }
});

export default router;