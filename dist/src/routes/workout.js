"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var prisma_1 = __importDefault(require("../../prisma/prisma"));
var client_1 = require("@prisma/client");
var router = express_1.default.Router();
/**
 * @route   POST /api/fitness/plans
 * @desc    Cria um plano de treino
 */
router.post("/plans", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, userId, plan, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name = _a.name, description = _a.description;
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.workoutPlan.create({
                        data: {
                            name: name,
                            description: description,
                            userId: userId,
                        },
                    })];
            case 1:
                plan = _b.sent();
                res.status(201).json(plan);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(400).json({
                    error: "Erro ao criar plano de treino",
                    details: error_1.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   GET /api/fitness/plans
 * @desc    Lista planos de treino do usuário
 */
router.get("/plans", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, plans, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.workoutPlan.findMany({
                        where: { userId: userId },
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
                    })];
            case 1:
                plans = _a.sent();
                res.json(plans);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ error: "Erro ao buscar planos de treino" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   PUT /api/fitness/plans/:id
 * @desc    Atualiza plano de treino
 */
router.put("/plans/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, description, isActive, userId, plan, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, name = _a.name, description = _a.description, isActive = _a.isActive;
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.workoutPlan.update({
                        where: {
                            id: id,
                            userId: userId,
                        },
                        data: {
                            name: name,
                            description: description,
                            isActive: isActive,
                        },
                    })];
            case 1:
                plan = _b.sent();
                res.json(plan);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                res.status(400).json({ error: "Erro ao atualizar plano" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   DELETE /api/fitness/plans/:id
 * @desc    Remove um plano de treino
 */
router.delete("/plans/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.workoutPlan.delete({
                        where: {
                            id: id,
                            userId: userId,
                        },
                    })];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(400).json({ error: "Erro ao remover plano" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   POST /api/fitness/plans/:planId/days
 * @desc    Adiciona um dia ao plano
 */
router.post("/plans/:planId/days", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var planId, _a, day, label, userId, plan, workoutDay, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                planId = req.params.planId;
                _a = req.body, day = _a.day, label = _a.label;
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.workoutPlan.findFirst({
                        where: { id: planId, userId: userId },
                    })];
            case 1:
                plan = _b.sent();
                if (!plan) {
                    return [2 /*return*/, res.status(404).json({ error: "Plano não encontrado" })];
                }
                return [4 /*yield*/, prisma_1.default.workoutDay.create({
                        data: {
                            day: day,
                            label: label,
                            workoutPlanId: planId,
                        },
                    })];
            case 2:
                workoutDay = _b.sent();
                res.status(201).json(workoutDay);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                res.status(400).json({
                    error: "Erro ao adicionar dia de treino",
                    details: error_5.message,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   POST /api/fitness/days/:dayId/exercises
 * @desc    Adiciona exercício a um dia de treino
 */
router.post("/days/:dayId/exercises", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dayId, _a, exerciseId, order, sets, reps, weight, restTime, exerciseOnDay, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                dayId = req.params.dayId;
                _a = req.body, exerciseId = _a.exerciseId, order = _a.order, sets = _a.sets, reps = _a.reps, weight = _a.weight, restTime = _a.restTime;
                return [4 /*yield*/, prisma_1.default.exerciseOnDay.create({
                        data: {
                            order: order,
                            sets: sets,
                            reps: reps,
                            weight: weight,
                            restTime: restTime,
                            exerciseId: exerciseId,
                            workoutDayId: dayId,
                        },
                    })];
            case 1:
                exerciseOnDay = _b.sent();
                res.status(201).json(exerciseOnDay);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                res.status(400).json({
                    error: "Erro ao adicionar exercício",
                    details: error_6.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put("/exercises-on-day/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, order, sets, reps, weight, restTime, exerciseId, updated;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, order = _a.order, sets = _a.sets, reps = _a.reps, weight = _a.weight, restTime = _a.restTime, exerciseId = _a.exerciseId;
                return [4 /*yield*/, prisma_1.default.exerciseOnDay.update({
                        where: { id: id },
                        data: {
                            order: order,
                            sets: sets,
                            reps: reps,
                            weight: weight,
                            restTime: restTime,
                            exerciseId: exerciseId,
                        },
                        include: {
                            exercise: true,
                        },
                    })];
            case 1:
                updated = _b.sent();
                res.json(updated);
                return [2 /*return*/];
        }
    });
}); });
var getTodayEnum = function () {
    var jsDay = new Date().getDay();
    switch (jsDay) {
        case 0:
            return client_1.DayOfWeek.SUNDAY;
        case 1:
            return client_1.DayOfWeek.MONDAY;
        case 2:
            return client_1.DayOfWeek.TUESDAY;
        case 3:
            return client_1.DayOfWeek.WEDNESDAY;
        case 4:
            return client_1.DayOfWeek.THURSDAY;
        case 5:
            return client_1.DayOfWeek.FRIDAY;
        case 6:
            return client_1.DayOfWeek.SATURDAY;
        default:
            throw new Error("Dia inválido");
    }
};
router.get("/users/by-phone/:phone/exercises/today", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var phone, user, today, workoutDays, exercises, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phone = req.params.phone;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma_1.default.user.findUnique({
                        where: { phone: phone },
                    })];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "Usuário não encontrado" })];
                }
                today = getTodayEnum();
                return [4 /*yield*/, prisma_1.default.workoutDay.findMany({
                        where: {
                            day: today,
                            workoutPlan: {
                                userId: user.id, // usa o ID do usuário encontrado
                                isActive: true,
                            },
                        },
                        include: {
                            exercises: {
                                orderBy: { order: "asc" },
                                include: { exercise: true },
                            },
                        },
                    })];
            case 3:
                workoutDays = _a.sent();
                console.log(workoutDays);
                exercises = workoutDays.flatMap(function (day) {
                    return day.exercises.map(function (e) { return ({
                        id: e.exercise.id,
                        name: e.exercise.name,
                        targetMuscle: e.exercise.targetMuscle,
                        videoUrl: e.exercise.videoUrl,
                        order: e.order,
                        sets: e.sets,
                        reps: e.reps,
                        weight: e.weight,
                        restTime: e.restTime,
                        plan: e.id
                    }); });
                });
                res.json(exercises);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                res.status(500).json({ error: "Erro ao buscar exercícios" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 Exercicios
 */
router.post("/exercises", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, targetMuscle, videoUrl, exercise, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name = _a.name, targetMuscle = _a.targetMuscle, videoUrl = _a.videoUrl;
                if (!name || !targetMuscle) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Nome e músculo alvo são obrigatórios",
                        })];
                }
                return [4 /*yield*/, prisma_1.default.exercise.create({
                        data: {
                            name: name,
                            targetMuscle: targetMuscle,
                            videoUrl: videoUrl,
                        },
                    })];
            case 1:
                exercise = _b.sent();
                res.status(201).json(exercise);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _b.sent();
                if (error_7.code === "P2002") {
                    return [2 /*return*/, res.status(409).json({
                            error: "Já existe um exercício com esse nome",
                        })];
                }
                res.status(400).json({
                    error: "Erro ao criar exercício",
                    details: error_7.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/exercises", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var search, exercises, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                search = req.query.search;
                return [4 /*yield*/, prisma_1.default.exercise.findMany({
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
                    })];
            case 1:
                exercises = _a.sent();
                res.json(exercises);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                res.status(500).json({
                    error: "Erro ao buscar exercícios",
                    details: error_8.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete("/exercises-on-day/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma_1.default.exerciseOnDay.delete({
                        where: { id: id },
                    })];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                res.status(400).json({
                    error: "Erro ao remover exercício",
                    details: error_9.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=workout.js.map