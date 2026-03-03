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
var router = express_1.default.Router();
/**
 * @route   GET /api/private/auth/me
 * @desc    Retorna os dados do usuário autenticado pelo Token
 * @access  Private (Requer middleware de autenticação)
 */
router.get('/me', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.user.findUnique({
                        where: { id: userId },
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true, // Se você tiver roles no schema
                            createdAt: true,
                            // Não selecionamos o 'password' por segurança
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: 'Usuário não encontrado' })];
                }
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({
                    error: 'Erro ao buscar dados do perfil',
                    details: error_1.message
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   PUT /api/private/auth/update
 * @desc    Atualiza nome e/ou senha do usuário
 */
router.put('/update', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name, password, updateData, updatedUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = req.user.id;
                _a = req.body, name = _a.name, password = _a.password;
                updateData = {};
                if (name)
                    updateData.name = name;
                // Se houver senha, você deve hashear antes de salvar
                if (password) {
                    // const hashedPassword = await bcrypt.hash(password, 10);
                    // updateData.password = hashedPassword;
                    updateData.password = password; // Lembre-se de criptografar aqui!
                }
                return [4 /*yield*/, prisma_1.default.user.update({
                        where: { id: userId },
                        data: updateData,
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    })];
            case 1:
                updatedUser = _b.sent();
                res.json(updatedUser);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                res.status(400).json({ error: 'Erro ao atualizar perfil' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=me.js.map