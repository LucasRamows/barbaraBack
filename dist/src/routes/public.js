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
var express_1 = require("express");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var prisma_1 = __importDefault(require("../../prisma/prisma"));
var router = (0, express_1.Router)();
var SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_aqui";
/**
 * POST /auth/register
 * Cria um novo usuário com hash de senha no campo 'key'
 */
router.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, birthDay, phone, role, userExists, saltRounds, hashedKey, newUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, birthDay = _a.birthDay, phone = _a.phone, role = _a.role;
                // 1. Validação básica
                if (!name || !email || !password) {
                    return [2 /*return*/, res.status(400).json({ error: "Nome, email e senha são obrigatórios." })];
                }
                return [4 /*yield*/, prisma_1.default.user.findFirst({
                        where: {
                            OR: [
                                { email: email },
                                { phone: phone || undefined }
                            ]
                        }
                    })];
            case 1:
                userExists = _b.sent();
                if (userExists) {
                    return [2 /*return*/, res.status(400).json({ error: "Email ou telefone já cadastrados." })];
                }
                saltRounds = 10;
                return [4 /*yield*/, bcryptjs_1.default.hash(password, saltRounds)];
            case 2:
                hashedKey = _b.sent();
                return [4 /*yield*/, prisma_1.default.user.create({
                        data: {
                            name: name,
                            email: email,
                            birthDay: birthDay,
                            phone: phone,
                            role: role || 'USER',
                            key: hashedKey,
                        },
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            createdAt: true
                        }
                    })];
            case 3:
                newUser = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        message: "Usuário criado com sucesso!",
                        user: newUser
                    })];
            case 4:
                error_1 = _b.sent();
                console.error("Erro no registro:", error_1);
                return [2 /*return*/, res.status(500).json({ error: "Erro interno ao processar o cadastro." })];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /auth/login
 * Autentica o usuário e retorna um JWT
 */
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma_1.default.user.findUnique({ where: { email: email } })];
            case 2:
                user = _b.sent();
                if (!user || !user.key) {
                    return [2 /*return*/, res.status(400).json({ error: "Credenciais inválidas." })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.key)];
            case 3:
                isMatch = _b.sent();
                if (!isMatch) {
                    return [2 /*return*/, res.status(400).json({ error: "Credenciais inválidas." })];
                }
                token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, SECRET_KEY);
                res.json({
                    token: token,
                    user: {
                        id: user.id,
                        name: user.name,
                        role: user.role
                    }
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.error("Erro no login:", err_1);
                res.status(500).json({ error: "Erro no servidor." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=public.js.map