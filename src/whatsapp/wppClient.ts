import { Client, LocalAuth } from "whatsapp-web.js";
import QRCode from "qrcode";
import { convertToObject } from "typescript";
import treatRecivedMessage from "./treatMessages/treatRecivedMessages";
// Variáveis de estado globais no escopo do serviço
let lastQrBase64 = "";
let clientReady = false;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
} as any);


// Evento disparado quando um novo QR Code é gerado
client.on("qr", async (qr) => {
  console.log("Sistema: Novo QR Code gerado.");
  lastQrBase64 = await QRCode.toDataURL(qr);
  clientReady = false;
});

// Evento disparado quando a conexão é estabelecida
client.on("ready", () => {
  console.log("Sistema: WhatsApp Conectado com Sucesso!");
  clientReady = true;
  lastQrBase64 = ""; // Limpa o QR após conectar
});

client.on("disconnected", () => {
  console.log("Sistema: WhatsApp Desconectado.");
  clientReady = false;
  lastQrBase64 = "";
});

// Inicializa o processo
client.initialize();

// Exporta funções para as rotas consultarem o estado interno
export const getWppStatus = () => ({
  connected: clientReady,
  qrCode: lastQrBase64,
});

const sendMessage = async (number: string, messages: string[]) => {
  for (let i = 0; i < messages.length; i++) {
    await client.sendMessage(number, messages[i]);
    console.log(`[INFO] Mensagem enviada para ${number}: ${messages[i]}`);
  }
};

client.on("message", async (msg: any) => {
  const response = await treatRecivedMessage(msg);
  console.log("msg")

  if (response && Array.isArray(response) && response.length > 0) {
    await sendMessage(msg.from, response);
  }
});

export { client };
export const resetWppStatus = () => {
  clientReady = false;
  lastQrBase64 = "";
};