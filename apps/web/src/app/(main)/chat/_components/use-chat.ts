import { create } from "zustand";

import { type Conversation, currentUser, conversations as seedConversations } from "./data";

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type ChatStore = {
  conversations: Conversation[];
  selected: number | null;
  messages: ChatMessage[];
  isLoading: boolean;
  selectedModel: string;

  selectConversation: (id: number) => void;
  createConversation: () => void;
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  setLoading: (loading: boolean) => void;
  setSelectedModel: (model: string) => void;
  sendMessage: (content: string) => Promise<void>;
};

let nextId = 10_000;

const useChatStore = create<ChatStore>((set, get) => ({
  conversations: seedConversations,
  selected: seedConversations[0]?.id ?? null,
  messages: [],
  isLoading: false,
  selectedModel: "openai/gpt-4o",

  selectConversation: (id) => set({ selected: id, messages: [] }),

  createConversation: () => {
    const id = ++nextId;
    const now = new Date().toISOString();
    const newConv: Conversation = {
      id,
      group: "Today",
      name: currentUser.name,
      subject: "Nova conversa",
      subjectKey: "chat.newConversation",
      preview: "",
      previewKey: "",
      time: now,
      isUnread: false,
      isOnline: true,
      unreadCount: 0,
      contact: {
        name: currentUser.name,
        role: "Assistente AI",
        roleKey: "",
        company: "",
        email: "",
        phone: "",
        website: "",
        location: "",
        timezone: "",
        status: "Active",
        statusKey: "",
        qualifiedAt: now,
        tags: [],
        tagKeys: [],
      },
      messages: [],
    };
    set((state) => ({
      conversations: [newConv, ...state.conversations],
      selected: id,
      messages: [],
    }));
  },

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  updateLastAssistantMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.role === "assistant") {
        msgs[msgs.length - 1] = { ...last, content };
      }
      return { messages: msgs };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setSelectedModel: (model) => set({ selectedModel: model }),

  sendMessage: async (content) => {
    const state = get();
    if (!content.trim() || state.isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content,
    };
    set((s) => ({ messages: [...s.messages, userMessage], isLoading: true }));

    try {
      const allMessages = [...get().messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages,
          model: get().selectedModel,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "",
      };
      set((s) => ({ messages: [...s.messages, assistantMessage] }));

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              assistantContent += parsed.content;
              get().updateLastAssistantMessage(assistantContent);
            }
          } catch {
            /* skip */
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      set((s) => ({
        messages: [
          ...s.messages,
          {
            id: Date.now() + 2,
            role: "assistant",
            content: "Desculpe, ocorreu um erro ao processar sua mensagem.",
          },
        ],
      }));
    } finally {
      set({ isLoading: false });
    }
  },
}));

export function useChat() {
  return useChatStore();
}
