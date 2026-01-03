import cors from "cors";
import express from "express";

// Importação das Rotas
import finance from "./src/routes/financial";
import workout from "./src/routes/workout";
import me from "./src/routes/me";
import publ from "./src/routes/public";
import notes from "./src/routes/notes";
import whatsappRoutes from "./src/routes/whatsapp"; // Nova Rota
import publicRoutes from "./src/routes/public";

// Middleware
import auth from "./src/middlewares/auth";

const app = express();
app.use(express.json());
app.use(cors());

// Rotas Públicas
app.use("/public", publicRoutes);

// Rotas Privadas (Todas protegidas pelo middleware 'auth')
app.use("/private", auth, finance);
app.use("/private", auth, workout);
app.use("/private", auth, me);
app.use("/private", auth, notes);
app.use("/private", auth, whatsappRoutes); // Registro da nova rota de WhatsApp
app.use("/public", publ); 

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

import "./src/whatsapp/wppClient";