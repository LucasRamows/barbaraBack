"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_aqui";
var auth = function (req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map