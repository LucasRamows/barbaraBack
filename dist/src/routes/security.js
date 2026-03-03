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
 * @route   POST /api/security/credentials
 * @desc    Guarda uma nova credencial criptografada no cofre
 */
router.post("/credentials", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, site, email, password, userId, credential, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, site = _a.site, email = _a.email, password = _a.password;
                userId = req.user.id;
                if (!site || !email || !password) {
                    return [2 /*return*/, res.status(400).json({ error: "Campos obrigatórios em falta" })];
                }
                return [4 /*yield*/, prisma_1.default.security.create({
                        data: {
                            site: site,
                            email: email,
                            password: password, // Esta string já deve vir criptografada do Frontend (RSA)
                            userId: userId,
                        },
                    })];
            case 1:
                credential = _b.sent();
                res.status(201).json(credential);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res
                    .status(400)
                    .json({ error: "Erro ao registar credencial", details: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/*
 * @route   POST /api/security/credentials
 * @desc    Guarda uma nova chave publica
 */
router.put("/publickey", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, userId, settings, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                key = req.body.key;
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.settings.update({
                        where: {
                            userId: userId
                        },
                        data: {
                            publicKey: key,
                        },
                    })];
            case 1:
                settings = _a.sent();
                return [2 /*return*/, res.status(200).json(settings)];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, res.status(400).json({
                        error: "Erro ao registrar key",
                        details: error_2.message,
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   GET /api/security/credentials
 * @desc    Lista todas as credenciais criptografadas do utilizador
 */
router.get("/publickey", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, key, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.settings.findMany({
                        where: { userId: userId },
                    })];
            case 1:
                key = _a.sent();
                res.json(key);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ error: "Erro ao procurar key" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   GET /api/security/credentials
 * @desc    Lista todas as credenciais criptografadas do utilizador
 */
router.get("/credentials", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, credentials, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.security.findMany({
                        where: { userId: userId },
                        orderBy: { createdAt: "desc" },
                    })];
            case 1:
                credentials = _a.sent();
                res.json(credentials);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({ error: "Erro ao procurar credenciais" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   PUT /api/security/credentials/:id
 * @desc    Atualiza uma credencial existente
 */
router.put("/credentials/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, site, email, password, userId, credential, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, site = _a.site, email = _a.email, password = _a.password;
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.security.update({
                        where: {
                            id: id,
                            userId: userId,
                        },
                        data: {
                            site: site,
                            email: email,
                            password: password,
                        },
                    })];
            case 1:
                credential = _b.sent();
                res.json(credential);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                res.status(400).json({ error: "Erro ao atualizar credencial" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   DELETE /api/security/credentials/:id
 * @desc    Remove uma credencial do cofre
 */
router.delete("/credentials/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.security.delete({
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
                error_6 = _a.sent();
                res.status(400).json({ error: "Erro ao eliminar credencial" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route   GET /api/security/stats
 * @desc    Retorna estatísticas simples do cofre (ex: contagem)
 */
router.get("/stats", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, count, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user.id;
                return [4 /*yield*/, prisma_1.default.security.count({
                        where: { userId: userId },
                    })];
            case 1:
                count = _a.sent();
                res.json({ totalCredentials: count });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.status(500).json({ error: "Erro ao obter estatísticas" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=security.js.map