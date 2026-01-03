import express from 'express';
import prisma from '../../prisma/prisma';

const router = express.Router();

/**
 * @route   POST /api/finance/transactions
 * @desc    Cria uma nova transação (Entrada ou Saída)
 */
  router.post('/transactions', async (req:any, res:any) => {
    try {
      const { description, amount, type, category, date } = req.body;
      console.log(req.body);
      const userId = req.user.id;   
      const transaction = await prisma.transaction.create({
        data: {
          description,
          amount: parseFloat(amount),
          type, // 'INCOME' ou 'EXPENSE'
          category,
          date: date ? new Date(date) : new Date(),
          userId,
        },
      });

      res.status(201).json(transaction);
    } catch (error:any) {
      res.status(400).json({ error: 'Erro ao registar transação', details: error.message });
    }
  });

/**
 * @route   GET /api/finance/transactions
 * @desc    Lista transações com filtro opcional de mês/ano
 */
router.get('/transactions', async (req:any, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao procurar transações' });
  }
});

/**
 * @route   GET /api/finance/summary
 * @desc    Retorna o resumo (Total de entradas, saídas e saldo)
 */
router.get('/summary', async (req:any, res) => {
  try {
    const userId = req.user.id;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    const summary = transactions.reduce(
      (acc:any, curr:any) => {
        if (curr.type === 'INCOME') {
          acc.income += curr.amount;
        } else {
          acc.expense += curr.amount;
        }
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar resumo financeiro' });
  }
});

/**
 * @route   PUT /api/finance/transactions/:id
 * @desc    Atualiza uma transação existente
 */
router.put('/transactions/:id', async (req:any, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, category, date } = req.body;
    const userId = req.user.id;

    const transaction = await prisma.transaction.update({
      where: { id, userId }, // Garante que o utilizador só edita o que lhe pertence
      data: {
        description,
        amount: amount ? parseFloat(amount) : undefined,
        type,
        category,
        date: date ? new Date(date) : undefined,
      },
    });

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar transação' });
  }
});

/**
 * @route   DELETE /api/finance/transactions/:id
 * @desc    Remove uma transação
 */
router.delete('/transactions/:id', async (req:any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.transaction.delete({
      where: { id, userId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao eliminar transação' });
  }
});

/**
 * @route   GET /api/finance/stats/categories
 * @desc    Retorna gastos agrupados por categoria (para gráficos)
 */
router.get('/stats/categories', async (req:any, res) => {
  try {
    const userId = req.user.id;

    const stats = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        type: 'EXPENSE',
      },
      _sum: {
        amount: true,
      },
    });

    const formattedStats = stats.map((s:any) => ({
      category: s.category,
      total: s._sum.amount,
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter estatísticas por categoria' });
  }
});

export default router;