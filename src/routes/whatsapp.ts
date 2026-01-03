import { Router } from "express";
import { client, getWppStatus, resetWppStatus } from "../whatsapp/wppClient";

const router = Router();

/**
 * @route   GET /private/whatsapp/status
 * @desc  
 */
router.get("/status", (req, res) => {
  try {
    const status = getWppStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar status do WhatsApp" });
  }
});

/**
 * @route   POST /private/whatsapp/logout
 * @desc    Desconecta a sessão atual
 */

router.post("/logout", async (req, res) => {
  try {
    console.log("Iniciando desconexão...");
    
    await client.logout();
    
    await client.destroy();
    
    resetWppStatus();

    await client.initialize();

    res.json({ message: "Desconectado e pronto para nova conexão" });
  } catch (error) {
    console.error("Erro ao desconectar:", error);
    res.status(500).json({ error: "Erro ao desconectar" });
  }
});

export default router;