"use client";

import { useState } from "react";

import { ChevronDown, Cpu, Keyboard, MoreHorizontal, Plus, Server, Settings2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Section = "general" | "shortcuts" | "servers" | "providers" | "models";

interface NavGroup {
  label: string;
  items: Array<{ id: Section; label: string; icon: React.ElementType }>;
}

const navGroups: NavGroup[] = [
  {
    label: "Desktop",
    items: [
      { id: "general", label: "Geral", icon: Settings2 },
      { id: "shortcuts", label: "Atalhos", icon: Keyboard },
    ],
  },
  {
    label: "Servidor",
    items: [
      { id: "servers", label: "Servidores", icon: Server },
      { id: "providers", label: "Provedores", icon: Sparkles },
      { id: "models", label: "Modelos", icon: Cpu },
    ],
  },
];

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  const [activeSection, setActiveSection] = useState<Section>("general");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] max-h-[90vh] w-[95vw] max-w-[480px] gap-0 overflow-hidden p-0 sm:max-w-[640px] md:max-w-[800px] lg:max-w-[960px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>
        <div className="flex h-full overflow-hidden">
          <nav className="hidden w-56 shrink-0 overflow-y-auto border-r bg-sidebar p-3 md:block">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-4">
                <div className="mb-1 px-2 font-medium text-muted-foreground text-xs">{group.label}</div>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                          activeSection === item.id
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                        )}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <Icon className="size-4 shrink-0" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="mt-auto border-t pt-3">
              <div className="px-2 text-muted-foreground text-xs">Studio Admin</div>
              <div className="px-2 text-muted-foreground text-xs">v1.0.0</div>
            </div>
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto bg-background p-6">
            {activeSection === "general" && <GeneralSettings />}
            {activeSection === "shortcuts" && <ShortcutsSettings />}
            {activeSection === "servers" && <ServersSettings />}
            {activeSection === "providers" && <ProvidersSettings />}
            {activeSection === "models" && <ModelsSettings />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-8 py-4">
      <div className="min-w-0 flex-1 space-y-0.5">
        <Label className="font-medium text-sm">{title}</Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 font-semibold text-lg">Geral</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow title="Idioma" description="Alterar o idioma de exibição do OpenCode">
              <Select defaultValue="pt-BR">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow
              title="Aceitar permissões automaticamente"
              description="Solicitações de permissão serão aprovadas automaticamente"
            >
              <Switch />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Shell do terminal"
              description="Escolha o shell usado no terminal. Os shells compatíveis também são usados nas chamadas de ferramentas do agente."
            >
              <Select defaultValue="auto">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automático (padrão)</SelectItem>
                  <SelectItem value="bash">Bash</SelectItem>
                  <SelectItem value="zsh">Zsh</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow
              title="Mostrar resumos de raciocínio"
              description="Exibir resumos de raciocínio do modelo na linha do tempo"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Expandir partes da ferramenta shell"
              description="Mostrar partes da ferramenta shell expandidas por padrão na linha do tempo"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Expandir partes da ferramenta de edição"
              description="Mostrar partes das ferramentas de edição, escrita e patch expandidas por padrão na linha do tempo"
            >
              <Switch defaultChecked />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Aparência</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Esquema de cores"
              description="Escolha se o OpenCode segue o tema do sistema, claro ou escuro"
            >
              <Select defaultValue="system">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Tema" description="Personalize como o OpenCode é tematizado.">
              <Select defaultValue="oc-2">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oc-2">OC-2</SelectItem>
                  <SelectItem value="oc-1">OC-1</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Fonte da interface" description="Personalize a fonte usada em toda a interface">
              <Select defaultValue="system-sans">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system-sans">System Sans</SelectItem>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="geist">Geist</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Fonte de código" description="Personalize a fonte usada em blocos de código">
              <Select defaultValue="system-mono">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system-mono">System Mono</SelectItem>
                  <SelectItem value="geist-mono">Geist Mono</SelectItem>
                  <SelectItem value="jetbrains-mono">JetBrains Mono</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Fonte do terminal" description="Personalize a fonte usada no terminal">
              <Select defaultValue="jetbrains-mono-nerd">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jetbrains-mono-nerd">JetBrainsMono Nerd Font</SelectItem>
                  <SelectItem value="geist-mono">Geist Mono</SelectItem>
                  <SelectItem value="fira-code">Fira Code</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Notificações do sistema</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Agente"
              description="Mostrar notificação do sistema quando o agente concluir o trabalho ou precisar de atenção"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Permissões"
              description="Mostrar notificação do sistema quando uma permissão for necessária"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow title="Erros" description="Mostrar notificação do sistema quando ocorrer um erro">
              <Switch defaultChecked />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Efeitos sonoros</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Agente"
              description="Reproduzir som quando o agente concluir o trabalho ou precisar de atenção"
            >
              <Select defaultValue="staplebops-01">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staplebops-01">Staplebops 01</SelectItem>
                  <SelectItem value="staplebops-02">Staplebops 02</SelectItem>
                  <SelectItem value="none">Nenhum</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Permissões" description="Reproduzir som quando uma permissão for necessária">
              <Select defaultValue="staplebops-02">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staplebops-01">Staplebops 01</SelectItem>
                  <SelectItem value="staplebops-02">Staplebops 02</SelectItem>
                  <SelectItem value="none">Nenhum</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Erros" description="Reproduzir som quando ocorrer um erro">
              <Select defaultValue="nao-03">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao-03">Não 03</SelectItem>
                  <SelectItem value="staplebops-01">Staplebops 01</SelectItem>
                  <SelectItem value="none">Nenhum</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Avançado</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow title="Árvore de arquivos" description="Mostrar o painel da árvore de arquivos nas sessões">
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Paleta de comandos"
              description="Mostrar o botão de busca e paleta de comandos na barra de título"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Status do servidor"
              description="Mostrar o botão de status do servidor na barra de título"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Mostrar agente"
              description="Alternar entre agentes na área de composição. Quando oculto, usa o agente Build como padrão."
            >
              <Switch defaultChecked />
            </SettingRow>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutsSettings() {
  return (
    <div>
      <h2 className="mb-4 font-semibold text-lg">Atalhos</h2>
      <div className="rounded-lg border bg-card p-4 text-muted-foreground text-sm">
        Configuração de atalhos de teclado em breve.
      </div>
    </div>
  );
}

function ServersSettings() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Servidores</h2>
        <Button variant="ghost" size="sm">
          <Plus className="mr-1 size-4" />
          Adicionar servidor
        </Button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-green-500" />
            <div>
              <p className="font-medium text-sm">8081-cs-88875918477-default.cs-us-east1-pkhd.cloudshell.dev</p>
              <p className="text-muted-foreground text-xs">sem nome de usuário</p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const providers = [
  {
    name: "OpenCode Zen",
    badge: "Recomendado",
    description: "Modelos selecionados incluindo Claude, GPT, Gemini e mais",
    icon: "Z",
  },
  {
    name: "OpenCode Go",
    badge: "Recomendado",
    description: "Assinatura de baixo custo para todos",
    icon: "G",
  },
  {
    name: "Anthropic",
    description: "Acesso direto aos modelos Claude, incluindo Pro e Max",
    icon: "A",
  },
  {
    name: "GitHub Copilot",
    description: "Modelos de IA para auxílio à programação pelo GitHub Copilot",
    icon: "GH",
  },
  {
    name: "OpenAI",
    description: "Modelos GPT rápidos e avançados para tarefas gerais de IA",
    icon: "O",
  },
  {
    name: "Google",
    description: "Modelos Gemini para respostas rápidas e estruturadas",
    icon: "✦",
  },
  {
    name: "OpenRouter",
    description: "Acesse todos os modelos suportados de um único provedor",
    icon: "OR",
  },
  {
    name: "Vercel AI Gateway",
    description: "Acesso unificado a modelos de IA com roteamento inteligente",
    icon: "▲",
  },
  {
    name: "Provedor personalizado",
    badge: "Personalizado",
    description: "Adicionar um provedor compatível com OpenAI por meio da URL base.",
    icon: "✿",
  },
];

function ProvidersSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg">Provedores</h2>

      <div>
        <h3 className="mb-2 font-medium text-sm">Provedores conectados</h3>
        <div className="rounded-lg border bg-card p-4 text-muted-foreground text-sm">Nenhum provedor conectado</div>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-sm">Provedores populares</h3>
        <div className="rounded-lg border bg-card">
          {providers.map((provider, index) => (
            <div key={provider.name}>
              {index > 0 && <Separator />}
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted font-medium text-xs">
                    {provider.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{provider.name}</span>
                      {provider.badge && (
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">
                          {provider.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">{provider.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">
                  <Plus className="mr-1 size-3" />
                  Conectar
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button type="button" className="text-blue-400 text-sm hover:underline">
            Ver mais provedores
          </button>
        </div>
      </div>
    </div>
  );
}

const models = [
  { name: "Big Pickle", enabled: false },
  { name: "Ling 3.0 Flash Fin Free", enabled: true },
  { name: "MiMo V2.5 Free", enabled: true },
  { name: "Muse Spark 1.2 Free", enabled: false },
  { name: "Muse Spark 1.3 Free", enabled: true },
  { name: "Nemotron 3 Ultra Free", enabled: false },
  { name: "Nemotron 3.5 Lightning Free", enabled: true },
];

function ModelsSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg">Modelos</h2>

      <Input placeholder="Buscar modelos" />

      <div>
        <div className="mb-2 flex items-center gap-2">
          <ChevronDown className="size-4 text-muted-foreground" />
          <span className="flex size-6 items-center justify-center rounded-md bg-muted font-medium text-xs">Z</span>
          <span className="font-medium text-sm">OpenCode Zen</span>
        </div>
        <div className="rounded-lg border bg-card">
          {models.map((model, index) => (
            <div key={model.name}>
              {index > 0 && <Separator />}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm">{model.name}</span>
                <Switch defaultChecked={model.enabled} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
