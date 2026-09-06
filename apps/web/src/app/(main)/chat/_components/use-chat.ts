import { create } from "zustand";

import { type Conversation, conversations, type Message } from "./data";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type Config = {
  selected: Conversation["id"] | null;
  messages: ChatMessage[];
  isLoading: boolean;
};

type ChatStore = {
  chat: Config;
  setChat: (chat: Config) => void;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
};

const useChatStore = create<ChatStore>((set) => ({
  chat: {
    selected: conversations[0].id,
    messages: [],
    isLoading: false,
  },
  setChat: (chat) => set({ chat }),
  addMessage: (message) =>
    set((state) => ({
      chat: { ...state.chat, messages: [...state.chat.messages, message] },
    })),
  setLoading: (loading) =>
    set((state) => ({
      chat: { ...state.chat, isLoading: loading },
    })),
  clearMessages: () =>
    set((state) => ({
      chat: { ...state.chat, messages: [] },
    })),
}));

export function useChat() {
  const chat = useChatStore((state) => state.chat);
  const setChat = useChatStore((state) => state.setChat);
  const addMessage = useChatStore((state) => state.addMessage);
  const setLoading = useChatStore((state) => state.setLoading);
  const clearMessages = useChatStore((state) => state.clearMessages);

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content,
    };
    addMessage(userMessage);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chat.messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "",
      };
      addMessage(assistantMessage);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                // Update the last message in store
                set((state) => {
                  const messages = [...state.chat.messages];
                  const lastMsg = messages[messages.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    messages[messages.length - 1] = {
                      ...lastMsg,
                      content: assistantContent,
                    };
                  }
                  return { chat: { ...state.chat, messages } };
                });
              }
            } catch {
              // Skip
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      addMessage({
        id: Date.now() + 2,
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    ...chat,
    setChat,
    addMessage,
    setLoading,
    clearMessages,
    sendMessage,
  } as const;
}
