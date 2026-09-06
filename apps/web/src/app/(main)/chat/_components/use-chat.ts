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
  connectedProviders: Record<string, { name: string; npm: string; api?: string }>;

  selectConversation: (id: number) => void;
  createConversation: () => void;
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  setLoading: (loading: boolean) => void;
  setSelectedModel: (model: string) => void;
  loadConnectedProviders: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
};

let nextId = 10_000;

const useChatStore = create<ChatStore>((set, get) => ({
  conversations: seedConversations,
  selected: seedConversations[0]?.id ?? null,
  messages: [],
  isLoading: false,
  selectedModel: "",
  connectedProviders: {},

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

  loadConnectedProviders: async () => {
    try {
      const { configStorage, credentialsStorage } = await import("@/lib/storage");
      const config = await configStorage.read();
      const providers: Record<string, { name: string; npm: string; api?: string }> = {};

      for (const [id, provConfig] of Object.entries(config.providers)) {
        const cred = await credentialsStorage.get(id);
        if (cred) {
          providers[id] = { name: provConfig.name, npm: provConfig.npm, api: provConfig.api };
        }
      }

      const customProviders = await configStorage.getCustomProviders();
      for (const [id, custom] of Object.entries(customProviders)) {
        const cred = await credentialsStorage.get(id);
        if (cred) {
          providers[id] = { name: custom.name, npm: custom.npm ?? "@ai-sdk/openai-compatible", api: custom.baseUrl };
        }
      }

      set({ connectedProviders: providers });

      if (!get().selectedModel && Object.keys(providers).length > 0) {
        const { configStorage: cs } = await import("@/lib/storage");
        const cfg = await cs.read();
        const enabled = cfg.enabledModels;
        if (enabled.length > 0) {
          set({ selectedModel: enabled[0] });
        }
      }
    } catch {
      /* ignore */
    }
  },

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

      const modelId = get().selectedModel;
      const providers = get().connectedProviders;

      let providerId = "";
      let apiKey = "";
      let modelName = modelId;

      const slashIndex = modelId.indexOf("/");
      if (slashIndex > 0) {
        providerId = modelId.substring(0, slashIndex);
        modelName = modelId.substring(slashIndex + 1);
      }

      const { credentialsStorage } = await import("@/lib/storage");
      if (providerId) {
        const cred = await credentialsStorage.get(providerId);
        if (cred) {
          apiKey = cred;
        }
      }

      if (!apiKey) {
        const allCreds = await credentialsStorage.list();
        if (allCreds.length > 0) {
          const firstCred = await credentialsStorage.get(allCreds[0]);
          if (firstCred) {
            apiKey = firstCred;
            if (!providerId) providerId = allCreds[0];
          }
        }
      }

      const providerConfig = providers[providerId] ?? undefined;
      const params = new URLSearchParams();
      if (providerConfig) {
        params.set("providerConfig", JSON.stringify(providerConfig));
      }

      const url = `/api/chat${params.toString() ? `?${params.toString()}` : ""}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages,
          providerId: providerId || "openai",
          apiKey: apiKey || "",
          model: modelName,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error ?? `HTTP ${response.status}`);
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
      const msg = error instanceof Error ? error.message : "erro desconhecido";
      set((s) => ({
        messages: [
          ...s.messages,
          {
            id: Date.now() + 2,
            role: "assistant",
            content: `Erro: ${msg}`,
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
