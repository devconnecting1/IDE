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
      <DialogContent className="h-[85vh] max-h-[90vh] w-[95vw] max-w-[480px] gap-0 overflow-hidden p-0 sm:max-w-[640px] md:h-[80vh] md:max-w-[800px] lg:max-w-[960px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>
        <div className="flex h-full overflow-hidden">
          <nav className="w-44 shrink-0 overflow-y-auto border-r bg-sidebar p-3 sm:w-56">
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

const shortcutsData = {
  Aplicação: [
    { description: "Sair da aplicação", keybinding: "Ctrl+C / Ctrl+D / Ctrl+X Q" },
    { description: "Alternar painel de depuração", keybinding: "Não atribuído" },
    { description: "Alternar console", keybinding: "Não atribuído" },
    { description: "Escrever snapshot de heap", keybinding: "Não atribuído" },
    { description: "Alternar animações", keybinding: "Não atribuído" },
    { description: "Alternar contexto de arquivo", keybinding: "Não atribuído" },
    { description: "Alternar quebra de diff", keybinding: "Não atribuído" },
    { description: "Alternar resumo de cola", keybinding: "Não atribuído" },
    { description: "Alternar filtragem de diretório de sessão", keybinding: "Não atribuído" },
  ],
  "Paleta de Comandos & Navegação": [
    { description: "Listar comandos disponíveis", keybinding: "Ctrl+P" },
    { description: "Abrir diálogo de ajuda", keybinding: "Não atribuído" },
    { description: "Abrir documentação", keybinding: "Não atribuído" },
    { description: "Alternar painel which-key", keybinding: "Ctrl+Alt+K" },
    { description: "Alternar layout which-key", keybinding: "Ctrl+Alt+Shift+K" },
    { description: "Alternar visualização pendente which-key", keybinding: "Ctrl+Alt+Shift+P" },
    { description: "Grupo which-key anterior", keybinding: "Ctrl+Alt+Left / Ctrl+Alt+[" },
    { description: "Próximo grupo which-key", keybinding: "Ctrl+Alt+Right / Ctrl+Alt+]" },
    { description: "Rolar which-key para cima", keybinding: "Ctrl+Alt+Up / Ctrl+Alt+P" },
    { description: "Rolar which-key para baixo", keybinding: "Ctrl+Alt+Down / Ctrl+Alt+N" },
    { description: "Página which-key para cima", keybinding: "Ctrl+Alt+PageUp" },
    { description: "Página which-key para baixo", keybinding: "Ctrl+Alt+PageDown" },
    { description: "Ir para primeiro atalho which-key", keybinding: "Ctrl+Alt+Home" },
    { description: "Ir para último atalho which-key", keybinding: "Ctrl+Alt+End" },
  ],
  "Visualizador de Diff": [
    { description: "Abrir visualizador de diff", keybinding: "Não atribuído" },
    { description: "Fechar visualizador de diff", keybinding: "Escape / Q" },
    { description: "Alternar item do diff", keybinding: "Enter / Espaço" },
    { description: "Expandir item do diff", keybinding: "→" },
    { description: "Expandir todas as pastas do diff", keybinding: "E" },
    { description: "Recolher item do diff", keybinding: "←" },
    { description: "Alternar foco do diff", keybinding: "Tab" },
    { description: "Próximo bloco de diff", keybinding: "]" },
    { description: "Bloco de diff anterior", keybinding: "[" },
    { description: "Próximo arquivo de diff", keybinding: "N" },
    { description: "Arquivo de diff anterior", keybinding: "P" },
    { description: "Alternar árvore de arquivos do diff", keybinding: "B" },
    { description: "Alternar visualização de patch único", keybinding: "S" },
    { description: "Alternar fonte do diff", keybinding: "D" },
    { description: "Alternar diff split/unificado", keybinding: "V" },
    { description: "Mostrar mais atalhos do diff", keybinding: "?" },
  ],
  "Editor & Temas": [
    { description: "Abrir editor externo", keybinding: "Ctrl+X E" },
    { description: "Listar temas disponíveis", keybinding: "Ctrl+X T" },
    { description: "Alternar modo claro/escuro", keybinding: "Não atribuído" },
    { description: "Bloquear/desbloquear modo de tema", keybinding: "Não atribuído" },
  ],
  "Barra Lateral & Status": [
    { description: "Alternar barra lateral", keybinding: "Ctrl+X B" },
    { description: "Alternar barra de rolagem da sessão", keybinding: "Não atribuído" },
    { description: "Ver status", keybinding: "Ctrl+X S" },
    { description: "Ver informações de depuração", keybinding: "Não atribuído" },
  ],
  Sessões: [
    { description: "Exportar sessão no editor", keybinding: "Ctrl+X X" },
    { description: "Copiar transcrição da sessão", keybinding: "Não atribuído" },
    { description: "Mover sessão", keybinding: "Não atribuído" },
    { description: "Criar nova sessão", keybinding: "Ctrl+X N" },
    { description: "Listar todas as sessões", keybinding: "Ctrl+X L" },
    { description: "Linha do tempo da sessão", keybinding: "Ctrl+X G" },
    { description: "Bifurcar sessão a partir de mensagem", keybinding: "Não atribuído" },
    { description: "Renomear sessão", keybinding: "Ctrl+R" },
    { description: "Excluir sessão", keybinding: "Ctrl+D" },
    { description: "Compartilhar sessão atual", keybinding: "Não atribuído" },
    { description: "Descompartilhar sessão atual", keybinding: "Não atribuído" },
    { description: "Interromper sessão atual", keybinding: "Escape" },
    { description: "Subagentes em segundo plano", keybinding: "Ctrl+B" },
    { description: "Compactar sessão", keybinding: "Ctrl+X C" },
    { description: "Alternar carimbos de data/hora das mensagens", keybinding: "Não atribuído" },
    { description: "Alternar saída de ferramenta genérica", keybinding: "Não atribuído" },
    { description: "Gerenciar prompts na fila", keybinding: "Ctrl+X Q" },
    { description: "Ir para primeira sessão filha", keybinding: "Ctrl+X ↓" },
    { description: "Próxima sessão filha", keybinding: "→" },
    { description: "Sessão filha anterior", keybinding: "←" },
    { description: "Sessão pai", keybinding: "↑" },
    { description: "Fixar/desfixar sessão na lista", keybinding: "Ctrl+F" },
  ],
  "Troca Rápida de Sessão": [
    { description: "Ir para sessão no slot 1", keybinding: "Ctrl+X 1" },
    { description: "Ir para sessão no slot 2", keybinding: "Ctrl+X 2" },
    { description: "Ir para sessão no slot 3", keybinding: "Ctrl+X 3" },
    { description: "Ir para sessão no slot 4", keybinding: "Ctrl+X 4" },
    { description: "Ir para sessão no slot 5", keybinding: "Ctrl+X 5" },
    { description: "Ir para sessão no slot 6", keybinding: "Ctrl+X 6" },
    { description: "Ir para sessão no slot 7", keybinding: "Ctrl+X 7" },
    { description: "Ir para sessão no slot 8", keybinding: "Ctrl+X 8" },
    { description: "Ir para sessão no slot 9", keybinding: "Ctrl+X 9" },
  ],
  "Modelo & Provedor": [
    { description: "Abrir lista de provedores", keybinding: "Ctrl+A" },
    { description: "Alternar favorito do modelo", keybinding: "Ctrl+F" },
    { description: "Listar modelos disponíveis", keybinding: "Ctrl+X M" },
    { description: "Próximo modelo usado recentemente", keybinding: "F2" },
    { description: "Modelo usado recentemente anterior", keybinding: "Shift+F2" },
    { description: "Próximo modelo favorito", keybinding: "Não atribuído" },
    { description: "Modelo favorito anterior", keybinding: "Não atribuído" },
  ],
  "MCP & Plugins": [
    { description: "Listar servidores MCP", keybinding: "Não atribuído" },
    { description: "Conectar provedor", keybinding: "Não atribuído" },
    { description: "Alternar organização do console", keybinding: "Não atribuído" },
    { description: "Alternar plugin", keybinding: "Espaço" },
    { description: "Instalar plugin do diálogo", keybinding: "Shift+I" },
    { description: "Abrir diálogo de gerenciamento de plugins", keybinding: "Não atribuído" },
    { description: "Instalar plugin", keybinding: "Não atribuído" },
  ],
  "Agentes & Variantes": [
    { description: "Listar agentes", keybinding: "Ctrl+X A" },
    { description: "Próximo agente", keybinding: "Tab" },
    { description: "Agente anterior", keybinding: "Shift+Tab" },
    { description: "Ciclar variantes de modelo", keybinding: "Ctrl+T" },
    { description: "Listar variantes de modelo", keybinding: "Não atribuído" },
  ],
  "Rolagem de Mensagens": [
    { description: "Rolar mensagens para cima (página)", keybinding: "PageUp / Ctrl+Alt+B" },
    { description: "Rolar mensagens para baixo (página)", keybinding: "PageDown / Ctrl+Alt+F" },
    { description: "Rolar mensagens para cima (linha)", keybinding: "Ctrl+Alt+Y" },
    { description: "Rolar mensagens para baixo (linha)", keybinding: "Ctrl+Alt+E" },
    { description: "Rolar mensagens para cima (meia página)", keybinding: "Ctrl+Alt+U" },
    { description: "Rolar mensagens para baixo (meia página)", keybinding: "Ctrl+Alt+D" },
    { description: "Ir para primeira mensagem", keybinding: "Ctrl+G / Home" },
    { description: "Ir para última mensagem", keybinding: "Ctrl+Alt+G / End" },
    { description: "Próxima mensagem", keybinding: "Não atribuído" },
    { description: "Mensagem anterior", keybinding: "Não atribuído" },
    { description: "Ir para última mensagem do usuário", keybinding: "Não atribuído" },
  ],
  "Ações de Mensagem": [
    { description: "Copiar mensagem", keybinding: "Ctrl+X Y" },
    { description: "Desfazer mensagem", keybinding: "Ctrl+X U" },
    { description: "Refazer mensagem", keybinding: "Ctrl+X R" },
    { description: "Alternar ocultação de bloco de código", keybinding: "Ctrl+X H" },
    { description: "Alternar visibilidade de detalhes da ferramenta", keybinding: "Não atribuído" },
    { description: "Alternar visibilidade de blocos de pensamento", keybinding: "Não atribuído" },
  ],
  Prompt: [
    { description: "Enviar prompt", keybinding: "Não atribuído" },
    { description: "Limpar contexto do editor", keybinding: "Não atribuído" },
    { description: "Abrir seletor de habilidade", keybinding: "Não atribuído" },
    { description: "Guardar prompt", keybinding: "Não atribuído" },
    { description: "Recuperar prompt guardado", keybinding: "Não atribuído" },
    { description: "Listar prompts guardados", keybinding: "Não atribuído" },
    { description: "Definir espaço de trabalho", keybinding: "Não atribuído" },
  ],
  "Edição de Input": [
    { description: "Limpar campo de input", keybinding: "Ctrl+C" },
    { description: "Colar da área de transferência", keybinding: "Ctrl+V" },
    { description: "Enviar input", keybinding: "Enter" },
    { description: "Inserir nova linha no input", keybinding: "Shift+Enter / Ctrl+Enter / Alt+Enter / Ctrl+J" },
    { description: "Mover cursor para esquerda", keybinding: "← / Ctrl+B" },
    { description: "Mover cursor para direita", keybinding: "→ / Ctrl+F" },
    { description: "Mover cursor para cima", keybinding: "↑" },
    { description: "Mover cursor para baixo", keybinding: "↓" },
    { description: "Selecionar para esquerda", keybinding: "Shift+←" },
    { description: "Selecionar para direita", keybinding: "Shift+→" },
    { description: "Selecionar para cima", keybinding: "Shift+↑" },
    { description: "Selecionar para baixo", keybinding: "Shift+↓" },
    { description: "Ir para início da linha", keybinding: "Ctrl+A" },
    { description: "Ir para fim da linha", keybinding: "Ctrl+E" },
    { description: "Selecionar até o início da linha", keybinding: "Ctrl+Shift+A" },
    { description: "Selecionar até o fim da linha", keybinding: "Ctrl+Shift+E" },
    { description: "Ir para início da linha visual", keybinding: "Alt+A" },
    { description: "Ir para fim da linha visual", keybinding: "Alt+E" },
    { description: "Selecionar até o início da linha visual", keybinding: "Alt+Shift+A" },
    { description: "Selecionar até o fim da linha visual", keybinding: "Alt+Shift+E" },
    { description: "Ir para início do buffer", keybinding: "Home" },
    { description: "Ir para fim do buffer", keybinding: "End" },
    { description: "Selecionar até o início do buffer", keybinding: "Shift+Home" },
    { description: "Selecionar até o fim do buffer", keybinding: "Shift+End" },
    { description: "Excluir linha no input", keybinding: "Ctrl+Shift+D" },
    { description: "Excluir até o fim da linha", keybinding: "Ctrl+K" },
    { description: "Excluir até o início da linha", keybinding: "Ctrl+U" },
    { description: "Backspace no input", keybinding: "Backspace / Shift+Backspace" },
    { description: "Excluir caractere no input", keybinding: "Ctrl+D / Delete / Shift+Delete" },
    { description: "Desfazer no input", keybinding: "Ctrl+- / Super+Z" },
    { description: "Refazer no input", keybinding: "Ctrl+. / Super+Shift+Z" },
    { description: "Mover palavra para frente", keybinding: "Alt+F / Alt+→ / Ctrl+→" },
    { description: "Mover palavra para trás", keybinding: "Alt+B / Alt+← / Ctrl+←" },
    { description: "Selecionar palavra para frente", keybinding: "Alt+Shift+F / Alt+Shift+→" },
    { description: "Selecionar palavra para trás", keybinding: "Alt+Shift+B / Alt+Shift+←" },
    { description: "Excluir palavra para frente", keybinding: "Alt+D / Alt+Delete / Ctrl+Delete" },
    { description: "Excluir palavra para trás", keybinding: "Ctrl+W / Ctrl+Backspace / Alt+Backspace" },
    { description: "Selecionar tudo no input", keybinding: "Super+A" },
    { description: "Item de histórico anterior", keybinding: "↑" },
    { description: "Próximo item de histórico", keybinding: "↓" },
  ],
  "Navegação em Diálogo": [
    { description: "Item de diálogo anterior", keybinding: "↑ / Ctrl+P" },
    { description: "Próximo item de diálogo", keybinding: "↓ / Ctrl+N" },
    { description: "Página para cima no diálogo", keybinding: "PageUp" },
    { description: "Página para baixo no diálogo", keybinding: "PageDown" },
    { description: "Primeiro item do diálogo", keybinding: "Home" },
    { description: "Último item do diálogo", keybinding: "End" },
    { description: "Enviar item selecionado", keybinding: "Enter" },
    { description: "Enviar prompt do diálogo", keybinding: "Enter" },
    { description: "Alternar MCP no diálogo MCP", keybinding: "Espaço" },
    { description: "Nova cópia do projeto (mover sessão)", keybinding: "Ctrl+M" },
    { description: "Excluir cópia do projeto (mover sessão)", keybinding: "Ctrl+D" },
    { description: "Atualizar cópias do projeto (mover sessão)", keybinding: "Ctrl+R" },
  ],
  Autocomplete: [
    { description: "Item anterior do autocomplete", keybinding: "↑ / Ctrl+P" },
    { description: "Próximo item do autocomplete", keybinding: "↓ / Ctrl+N" },
    { description: "Ocultar autocomplete", keybinding: "Escape" },
    { description: "Selecionar item do autocomplete", keybinding: "Enter" },
    { description: "Completar item do autocomplete", keybinding: "Tab" },
  ],
  "Prompt de Permissão": [{ description: "Alternar tela cheia do prompt de permissão", keybinding: "Ctrl+F" }],
  "Terminal & Diversos": [
    { description: "Suspender terminal", keybinding: "Ctrl+Z" },
    { description: "Alternar título do terminal", keybinding: "Não atribuído" },
    { description: "Alternar dicas na tela inicial", keybinding: "Ctrl+X H" },
  ],
};

function ShortcutsSettings() {
  const [search, setSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(Object.keys(shortcutsData)));

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const filteredData = Object.entries(shortcutsData).reduce(
    (acc, [section, shortcuts]) => {
      const filtered = shortcuts.filter(
        (s) =>
          s.description.toLowerCase().includes(search.toLowerCase()) ||
          s.keybinding.toLowerCase().includes(search.toLowerCase()),
      );
      if (filtered.length > 0) {
        acc[section] = filtered;
      }
      return acc;
    },
    {} as Record<string, Array<{ description: string; keybinding: string }>>,
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-lg">Atalhos</h2>
      <Input placeholder="Pesquisar atalhos" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="flex flex-col gap-4 overflow-auto pr-1">
        {Object.keys(filteredData).length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">Nenhum atalho encontrado</p>
        ) : (
          Object.entries(filteredData).map(([section, shortcuts]) => (
            <div key={section}>
              <button
                type="button"
                className="flex w-full items-center gap-1 py-1 text-muted-foreground text-xs uppercase tracking-wide hover:text-foreground"
                onClick={() => toggleSection(section)}
              >
                <ChevronDown
                  className={cn("size-3 transition-transform", !expandedSections.has(section) && "-rotate-90")}
                />
                {section}
              </button>
              {expandedSections.has(section) && (
                <div className="mt-1 divide-y divide-border rounded-lg border">
                  {shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.description}
                      className="flex items-center justify-between bg-card px-3 py-2 text-sm"
                    >
                      <span className="text-muted-foreground">{shortcut.description}</span>
                      <kbd className="font-mono text-xs">{shortcut.keybinding}</kbd>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
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
