"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
// Importação das Rotas
var financial_1 = __importDefault(require("./src/routes/financial"));
var workout_1 = __importDefault(require("./src/routes/workout"));
var me_1 = __importDefault(require("./src/routes/me"));
var public_1 = __importDefault(require("./src/routes/public"));
var notes_1 = __importDefault(require("./src/routes/notes"));
var whatsapp_1 = __importDefault(require("./src/routes/whatsapp"));
var health_1 = __importDefault(require("./src/routes/health"));
var tasks_1 = __importDefault(require("./src/routes/tasks"));
var public_2 = __importDefault(require("./src/routes/public"));
// Middleware
var auth_1 = __importDefault(require("./src/middlewares/auth"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Rotas Públicas
app.use("/public", public_2.default);
// Rotas Privadas (Todas protegidas pelo middleware 'auth')
app.use("/private", auth_1.default, financial_1.default);
app.use("/private", auth_1.default, workout_1.default);
app.use("/private", auth_1.default, me_1.default);
app.use("/private", auth_1.default, notes_1.default);
app.use("/private", auth_1.default, whatsapp_1.default);
app.use("/private", auth_1.default, health_1.default);
app.use("/private", auth_1.default, tasks_1.default);
app.use("/public", public_1.default);
app.listen(3000, function () {
    console.log("Servidor rodando em http://localhost:3000");
});
require("./src/whatsapp/wppClient");
//# sourceMappingURL=index.js.map