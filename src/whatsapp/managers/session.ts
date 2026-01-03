import formatPhone from "../formatPhone";
import api from "./api";

interface UserSession {
  sessionId: string;
}

interface TypebotMessage {
  id: string;
  type: string;
  content: any;
}

interface StartChatResponse {
  sessionId: string;
  messages: TypebotMessage[];
}

interface ContinueChatResponse {
  messages: TypebotMessage[];
}

export class Users {
  private users: Record<string, UserSession>;

  constructor() {
    this.users = {};
  }

  async addUser(id: string): Promise<TypebotMessage[] | false> {
    try {
      const response = await api.post<StartChatResponse>(
        `/typebots/home-q5tsrgb/startChat`,
           {
          message: formatPhone(id),
          type: "text",
        }
      );

      const data = response.data;

      this.users[id] = {
        sessionId: data.sessionId,
      };

      return data.messages;
    } catch (error) {
      console.error("Erro ao add User:", error);
      return false;
    }
  }

  async getStep(id: string, msg: string): Promise<TypebotMessage[] | undefined> {
    try {
      const session = this.users[id];
      if (!session) throw new Error("Usuário não encontrado!");

      const response = await api.post<ContinueChatResponse>(
        `/sessions/${session.sessionId}/continueChat`,
        {
          message: msg,
          type: "text",
        }
      );

      const data = response.data;

      return data.messages;
    } catch (e) {
      console.log("Erro ao pegar msg do flow", e);
    }
  }

  async delete(id:string){
    delete this.users[id]
  }

  find(id: string): string | null {
    const session = this.users[id];
    return session ? session.sessionId : null;
  }
}