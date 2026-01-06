"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var router = express_1.default.Router();
/**
 * @route   POST /api/tasks
 * @desc    Cria uma nova tarefa com lembrete opcional
 */
router.post('/tasks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, type, description, date, isPriority, reminderTime, userId, task, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name = _a.name, type = _a.type, description = _a.description, date = _a.date, isPriority = _a.isPriority, reminderTime = _a.reminderTime;
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.task.create({
                        data: {
                            name: name,
                            type: type, // Ex: 'HEALTH', 'WORK'
                            description: description,
                            isPriority: isPriority || false,
                            date: new Date(date),
                            userId: userId,
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
                    })];
            case 1:
                task = _b.sent();
                res.status(201).json(task);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(400).json({ error: 'Erro ao criar tarefa', details: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   GET /api/tasks
 * @desc    Lista tarefas do usuário (com filtros opcionais)
 */
router.get('/tasks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, type, priority, tasks, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = req.user.id;
                _a = req.query, type = _a.type, priority = _a.priority;
                return [4 /*yield*/, prisma_1.default.task.findMany({
                        where: __assign(__assign({ userId: userId }, (type && { type: String(type) })), (priority && { isPriority: priority === 'true' })),
                        include: {
                            reminders: true, // Inclui os lembretes para exibir o horário na lista
                        },
                        orderBy: { date: 'asc' },
                    })];
            case 1:
                tasks = _b.sent();
                res.json(tasks);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                res.status(500).json({ error: 'Erro ao procurar tarefas' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   PUT /api/tasks/:id
 * @desc    Atualiza uma tarefa e seu status ou lembrete
 */
router.put('/tasks/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, status, description, date, isPriority, reminderTime, userId, task, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, name = _a.name, status = _a.status, description = _a.description, date = _a.date, isPriority = _a.isPriority, reminderTime = _a.reminderTime;
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.task.update({
                        where: { id: id, userId: userId },
                        data: {
                            name: name,
                            status: status, // boolean para marcar como concluído
                            description: description,
                            isPriority: isPriority,
                            date: date ? new Date(date) : undefined,
                            // Atualiza ou cria o lembrete se o horário for enviado
                            reminders: reminderTime ? {
                                deleteMany: {}, // Limpa anteriores (se houver relação 1-N simples)
                                create: { time: new Date(reminderTime) }
                            } : undefined
                        },
                        include: { reminders: true }
                    })];
            case 1:
                task = _b.sent();
                res.json(task);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                res.status(400).json({ error: 'Erro ao atualizar tarefa' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   DELETE /api/tasks/:id
 * @desc    Remove uma tarefa (o Prisma removerá o lembrete via Cascade)
 */
router.delete('/tasks/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.task.delete({
                        where: { id: id, userId: userId },
                    })];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(400).json({ error: 'Erro ao eliminar tarefa' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   GET /api/tasks/stats
 * @desc    Retorna estatísticas (Tarefas pendentes vs concluídas)
 */
router.get('/stats/summary', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, stats, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.task.groupBy({
                        by: ['status'],
                        where: { userId: userId },
                        _count: {
                            id: true,
                        },
                    })];
            case 1:
                stats = _a.sent();
                res.json(stats);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({ error: 'Erro ao obter estatísticas' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=tasks.js.map