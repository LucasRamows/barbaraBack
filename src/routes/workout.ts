import express from 'express';
import prisma from '../../prisma/prisma';

const router = express.Router();

/**
 * @route   POST /api/fitness/plans
 * @desc    Cria um plano de treino
 */
router.post('/plans', async (req: any, res: any) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const plan = await prisma.workoutPlan.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(201).json(plan);
  } catch (error: any) {
    res.status(400).json({
      error: 'Erro ao criar plano de treino',
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/fitness/plans
 * @desc    Lista planos de treino do usuário
 */
router.get('/plans', async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const plans = await prisma.workoutPlan.findMany({
      where: { userId },
      include: {
        days: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar planos de treino' });
  }
});

/**
 * @route   PUT /api/fitness/plans/:id
 * @desc    Atualiza plano de treino
 */
router.put('/plans/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    const userId = req.user.id;

    const plan = await prisma.workoutPlan.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
        description,
        isActive,
      },
    });

    res.json(plan);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar plano' });
  }
});

/**
 * @route   DELETE /api/fitness/plans/:id
 * @desc    Remove um plano de treino
 */
router.delete('/plans/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.workoutPlan.delete({
      where: {
        id,
        userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao remover plano' });
  }
});
/**
 * @route   POST /api/fitness/plans/:planId/days
 * @desc    Adiciona um dia ao plano
 */
router.post('/plans/:planId/days', async (req: any, res: any) => {
  try {
    const { planId } = req.params;
    const { day, label } = req.body;
    const userId = req.user.id;

    // garante que o plano é do usuário
    const plan = await prisma.workoutPlan.findFirst({
      where: { id: planId, userId },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    const workoutDay = await prisma.workoutDay.create({
      data: {
        day,
        label,
        workoutPlanId: planId,
      },
    });

    res.status(201).json(workoutDay);
  } catch (error: any) {
    res.status(400).json({
      error: 'Erro ao adicionar dia de treino',
      details: error.message,
    });
  }
});
/**
 * @route   POST /api/fitness/days/:dayId/exercises
 * @desc    Adiciona exercício a um dia de treino
 */
router.post('/days/:dayId/exercises', async (req: any, res: any) => {
  try {
    const { dayId } = req.params;
    const {
      exerciseId,
      order,
      sets,
      reps,
      weight,
      restTime,
    } = req.body;

    const exerciseOnDay = await prisma.exerciseOnDay.create({
      data: {
        order,
        sets,
        reps,
        weight,
        restTime,
        exerciseId,
        workoutDayId: dayId,
      },
    });

    res.status(201).json(exerciseOnDay);
  } catch (error: any) {
    res.status(400).json({
      error: 'Erro ao adicionar exercício',
      details: error.message,
    });
  }
});

router.put('/exercises-on-day/:id', async (req, res) => {
  const { id } = req.params;
  const { order, sets, reps, weight, restTime, exerciseId } = req.body;

  const updated = await prisma.exerciseOnDay.update({
    where: { id },
    data: {
      order,
      sets,
      reps,
      weight,
      restTime,
      exerciseId,
    },
    include: {
      exercise: true,
    },
  });

  res.json(updated);
});


/**
 Exercicios
 */

router.post("/exercises", async (req: any, res: any) => {
  try {
    const { name, targetMuscle, videoUrl } = req.body;

    if (!name || !targetMuscle) {
      return res.status(400).json({
        error: "Nome e músculo alvo são obrigatórios",
      });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        targetMuscle,
        videoUrl,
      },
    });

    res.status(201).json(exercise);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Já existe um exercício com esse nome",
      });
    }

    res.status(400).json({
      error: "Erro ao criar exercício",
      details: error.message,
    });
  }
});



router.get("/exercises", async (req: any, res: any) => {
  try {
    const { search } = req.query;

    const exercises = await prisma.exercise.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: {
        name: "asc",
      },
    });

    res.json(exercises);
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao buscar exercícios",
      details: error.message,
    });
  }
});

router.delete('/exercises-on-day/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.exerciseOnDay.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({
      error: 'Erro ao remover exercício',
      details: error.message,
    });
  }
});



export default router;