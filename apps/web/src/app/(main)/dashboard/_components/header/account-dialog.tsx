"use client";

import { useState } from "react";

import { ChevronDown, Cpu, Keyboard, MoreHorizontal, Plus, Search, Server, Settings2, Sparkles } from "lucide-react";

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
              <div className="px-2 text-muted-foreground text-xs">Workspaacing</div>
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

export function SettingRow({
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

export function GeneralSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 font-semibold text-lg">Geral</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Nome de exibição"
              description="Nome personalizado exibido na interface (padrão: nome do sistema)"
            >
              <Input className="w-44" placeholder="user" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Shell do terminal"
              description="Shell padrão para terminal e ferramentas bash. Detectado automaticamente por padrão."
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
                  <SelectItem value="powershell">PowerShell</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Nível de log" description="Controla a quantidade de informações de log registradas">
              <Select defaultValue="info">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">DEBUG</SelectItem>
                  <SelectItem value="info">INFO (padrão)</SelectItem>
                  <SelectItem value="warn">WARN</SelectItem>
                  <SelectItem value="error">ERROR</SelectItem>
                </SelectContent>
              </Select>
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
            <SettingRow title="Tema" description="Tema visual da interface do TUI">
              <Select defaultValue="default">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="supabase">Supabase</SelectItem>
                  <SelectItem value="vercel">Vercel</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Captura do mouse" description="Habilitar ou desabilitar a captura do mouse no TUI">
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Estilo do diff"
              description="Estilo de renderização do diff. 'Auto' se adapta à largura do terminal."
            >
              <Select defaultValue="auto">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (padrão)</SelectItem>
                  <SelectItem value="stacked">Empilhado</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Estilo do cursor" description="Formato do cursor no TUI">
              <Select defaultValue="block">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Bloco</SelectItem>
                  <SelectItem value="underline">Sublinhado</SelectItem>
                  <SelectItem value="line">Linha</SelectItem>
                  <SelectItem value="default">Padrão do terminal</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Piscar cursor" description="Se o cursor deve piscar no TUI">
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow title="Velocidade de rolagem" description="Velocidade de rolagem do TUI (mínimo: 0.001)">
              <Input className="w-24" type="number" defaultValue="1" min="0.001" step="0.1" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Aceleração de rolagem"
              description="Habilitar aceleração de rolagem ao girar a roda do mouse"
            >
              <Switch defaultChecked />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Notificações</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow title="Habilitar notificações" description="Ativar notificações desktop e sons do TUI">
              <Switch />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Notificações desktop"
              description="Mostrar notificações do sistema quando o agente concluir ou precisar de atenção"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow title="Sons" description="Reproduzir sons de notificação">
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow title="Volume" description="Volume dos sons de notificação (0-1)">
              <Input className="w-24" type="number" defaultValue="0.4" min="0" max="1" step="0.1" />
            </SettingRow>
            <Separator />
            <SettingRow title="Pacote de sons" description="Pacote de sons usado para notificações">
              <Select defaultValue="opencode.default">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opencode.default">OpenCode Padrão</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Compartilhamento & Atualizações</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow title="Compartilhamento" description="Controla como sessões são compartilhadas">
              <Select defaultValue="manual">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual (padrão)</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                  <SelectItem value="disabled">Desabilitado</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow
              title="Atualização automática"
              description="Comportamento de atualização automática do OpenCode"
            >
              <Select defaultValue="true">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Habilitado (padrão)</SelectItem>
                  <SelectItem value="false">Desabilitado</SelectItem>
                  <SelectItem value="notify">Apenas notificar</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Snapshot" description="Habilitar rastreamento de snapshot para restauração de sessões">
              <Switch defaultChecked />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Compactação</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Compactação automática"
              description="Compactar automaticamente quando o contexto estiver cheio"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Podar saídas de ferramentas"
              description="Habilitar poda de saídas de ferramentas antigas para economizar contexto"
            >
              <Switch />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Turnos recentes preservados"
              description="Número de turnos recentes a manter sem compactação"
            >
              <Input className="w-24" type="number" defaultValue="2" min="0" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Tokens recentes preservados"
              description="Número máximo de tokens dos turnos recentes a preservar"
            >
              <Input className="w-24" type="number" placeholder="auto" />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Imagens</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Redimensionar automaticamente"
              description="Redimensionar imagens que excedem os limites de tamanho"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow title="Largura máxima" description="Largura máxima de imagens em pixels">
              <Input className="w-24" type="number" defaultValue="2000" min="100" />
            </SettingRow>
            <Separator />
            <SettingRow title="Altura máxima" description="Altura máxima de imagens em pixels">
              <Input className="w-24" type="number" defaultValue="2000" min="100" />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Saída de Ferramentas</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Máximo de linhas"
              description="Número máximo de linhas antes de truncar a saída da ferramenta"
            >
              <Input className="w-24" type="number" defaultValue="2000" min="100" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Máximo de bytes"
              description="Número máximo de bytes antes de truncar a saída da ferramenta"
            >
              <Input className="w-24" type="number" defaultValue="51200" min="1024" />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Prompt</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow title="Altura máxima do prompt" description="Altura máxima da textarea de prompt em pixels">
              <Input className="w-24" type="number" placeholder="auto" min="100" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Largura máxima do prompt"
              description="Largura máxima do prompt na tela inicial. 'auto' escala com a interface."
            >
              <Select defaultValue="auto">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automático</SelectItem>
                  <SelectItem value="600">600px</SelectItem>
                  <SelectItem value="800">800px</SelectItem>
                  <SelectItem value="1000">1000px</SelectItem>
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
            <SettingRow
              title="Timeout da leader key"
              description="Tempo de espera em milissegundos para completar atalhos com leader key (Ctrl+X)"
            >
              <Input className="w-24" type="number" defaultValue="2000" min="500" step="100" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Ferramenta batch"
              description="Habilitar a ferramenta batch para executar múltiplas operações"
            >
              <Switch />
            </SettingRow>
            <Separator />
            <SettingRow title="OpenTelemetry" description="Habilitar spans OpenTelemetry para chamadas de IA">
              <Switch />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Continuar ao negar"
              description="Continuar loop do agente quando uma chamada de ferramenta for negada"
            >
              <Switch />
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

export function ShortcutsSettings() {
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

export function ServersSettings() {
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

const popularProviders = [
  {
    name: "OpenCode Zen",
    badge: "Recomendado",
    description: "Modelos otimizados e confiáveis",
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
    description: "Modelos Claude para código e raciocínio",
    icon: "A",
  },
  {
    name: "OpenAI",
    description: "Modelos GPT para tarefas gerais de IA",
    icon: "O",
  },
  {
    name: "Google",
    description: "Modelos Gemini para respostas rápidas",
    icon: "✦",
  },
  {
    name: "OpenRouter",
    description: "Acesse centenas de modelos de múltiplos provedores",
    icon: "OR",
  },
  {
    name: "Vercel AI Gateway",
    description: "Acesso unificado com roteamento inteligente",
    icon: "▲",
  },
];

const allProviders = [
  { name: "302.AI", icon: "302" },
  { name: "Abacus", icon: "Ab" },
  { name: "Alibaba", icon: "Al" },
  { name: "Amazon Bedrock", icon: "AB" },
  { name: "Arcee AI", icon: "Ar" },
  { name: "Azure", icon: "Az" },
  { name: "Bytedance Seed", icon: "BS" },
  { name: "Cerebras", icon: "Ce" },
  { name: "Cohere", icon: "Co" },
  { name: "DeepInfra", icon: "DI" },
  { name: "DeepSeek", icon: "DS" },
  { name: "Deepreinforce", icon: "Dr" },
  { name: "DigitalOcean", icon: "DO" },
  { name: "Evroc", icon: "Ev" },
  { name: "FastRouter", icon: "FR" },
  { name: "Fireworks AI", icon: "FW" },
  { name: "Firmware", icon: "Fi" },
  { name: "Friendli", icon: "Fl" },
  { name: "GitHub Copilot", icon: "GH" },
  { name: "GitHub Models", icon: "GM" },
  { name: "GitLab", icon: "GL" },
  { name: "Google", icon: "✦" },
  { name: "Google Vertex", icon: "GV" },
  { name: "Groq", icon: "Gr" },
  { name: "Helicone", icon: "He" },
  { name: "Huggingface", icon: "Hu" },
  { name: "IBM", icon: "IBM" },
  { name: "Inclusion AI", icon: "In" },
  { name: "Inception", icon: "Ic" },
  { name: "IO.net", icon: "IO" },
  { name: "Kilo", icon: "Ki" },
  { name: "Llama", icon: "Ll" },
  { name: "LM Studio", icon: "LM" },
  { name: "LucidQuery", icon: "LQ" },
  { name: "MegaNova", icon: "Me" },
  { name: "Meituan", icon: "Mt" },
  { name: "Microsoft", icon: "MS" },
  { name: "MiniMax", icon: "MM" },
  { name: "Mistral", icon: "Mi" },
  { name: "Moark", icon: "Mo" },
  { name: "ModelScope", icon: "MS" },
  { name: "Moonshot AI", icon: "MA" },
  { name: "Nebius", icon: "Nb" },
  { name: "Nova", icon: "Nv" },
  { name: "Nvidia", icon: "Nv" },
  { name: "Novita AI", icon: "NA" },
  { name: "Ollama Cloud", icon: "OC" },
  { name: "OpenAI", icon: "O" },
  { name: "OpenRouter", icon: "OR" },
  { name: "OVHcloud", icon: "OV" },
  { name: "Perplexity", icon: "Pe" },
  { name: "Poe", icon: "Po" },
  { name: "Poolside", icon: "PS" },
  { name: "PrivateMode AI", icon: "PM" },
  { name: "Qihang AI", icon: "QH" },
  { name: "Qiniu AI", icon: "QN" },
  { name: "Requesty", icon: "Rq" },
  { name: "Sakana AI", icon: "Sa" },
  { name: "Sarvam AI", icon: "Sv" },
  { name: "Scaleway", icon: "Sc" },
  { name: "Sdaia", icon: "Sd" },
  { name: "SiliconFlow", icon: "SF" },
  { name: "StepFun", icon: "St" },
  { name: "Swiss AI", icon: "Sw" },
  { name: "Synthetic", icon: "Sy" },
  { name: "Together AI", icon: "TA" },
  { name: "Trendyol", icon: "Tr" },
  { name: "Upstage", icon: "Up" },
  { name: "V0", icon: "V0" },
  { name: "Venice", icon: "Ve" },
  { name: "Vercel", icon: "▲" },
  { name: "VivGrid", icon: "VG" },
  { name: "Vultr", icon: "Vu" },
  { name: "WandB", icon: "WB" },
  { name: "xAI", icon: "X" },
  { name: "Xiaomi", icon: "Xi" },
  { name: "ZenMux", icon: "ZM" },
  { name: "Zhipu AI", icon: "Zp" },
];

export function ProvidersSettings() {
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [search, setSearch] = useState("");

  const filteredPopular = popularProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredAll = allProviders
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

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
          {popularProviders.map((provider, index) => (
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
          <button
            type="button"
            className="text-primary text-sm hover:underline"
            onClick={() => setShowAllProviders(true)}
          >
            Ver mais provedores
          </button>
        </div>
      </div>

      <Dialog open={showAllProviders} onOpenChange={setShowAllProviders}>
        <DialogContent className="flex h-[85vh] max-h-[90vh] w-[95vw] max-w-[480px] flex-col overflow-hidden rounded-2xl bg-background p-0 sm:max-w-[640px] md:h-[80vh] md:max-w-[800px] lg:max-w-[960px]">
          <DialogHeader className="border-b bg-sidebar p-4 text-sidebar-foreground">
            <DialogTitle>Conectar provedor</DialogTitle>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 gap-6 p-4">
            <div className="flex w-64 shrink-0 flex-col gap-4">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar provedores"
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="min-h-0 flex-1 overflow-auto">
                <h4 className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">Popular</h4>
                <div className="rounded-lg border bg-card">
                  {filteredPopular.map((provider, index) => (
                    <div key={provider.name}>
                      {index > 0 && <Separator />}
                      <div className="flex items-center gap-3 px-3 py-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted font-medium text-xs">
                          {provider.icon}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{provider.name}</span>
                          {provider.badge && (
                            <span className="rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">
                              {provider.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <h4 className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">Outro</h4>
              <div className="rounded-lg border bg-card">
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted font-medium text-xs">
                    ✿
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Provedor personalizado compatível com OpenAI</span>
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">
                      Personalizado
                    </span>
                  </div>
                </div>
                <Separator />
                {filteredAll.map((provider, index) => (
                  <div key={provider.name}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted font-medium text-[10px]">
                        {provider.icon}
                      </span>
                      <span className="text-sm">{provider.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const modelProviders = [
  {
    name: "OpenCode",
    icon: "OC",
    models: [{ name: "Big Pickle", description: "Modelo forte e rápido da OpenCode", enabled: true }],
  },
  {
    name: "Anthropic",
    icon: "A",
    models: [
      { name: "Claude Opus 5", description: "Modelo mais inteligente para tarefas complexas", enabled: false },
      { name: "Claude Sonnet 4", description: " equilíbrio ideal entre inteligência e velocidade", enabled: true },
      { name: "Claude Haiku 4.5", description: "Modelo rápido e eficiente para tarefas leves", enabled: true },
    ],
  },
  {
    name: "OpenAI",
    icon: "O",
    models: [
      { name: "GPT-5", description: "Modelo mais avançado da OpenAI", enabled: true },
      { name: "GPT-5 Nano", description: "Modelo leve e rápido para tarefas simples", enabled: false },
      { name: "GPT-6 Astra", description: "Próxima geração de modelos GPT", enabled: false },
    ],
  },
  {
    name: "Google",
    icon: "✦",
    models: [
      { name: "Gemini 3 Pro", description: "Modelo avançado com reasoning e multimodal", enabled: true },
      { name: "Gemini 3.7 Flash", description: "Modelo rápido para respostas ágeis", enabled: true },
      { name: "Gemini 3.8 Flash", description: "Versão aprimorada do Flash", enabled: false },
    ],
  },
  {
    name: "xAI",
    icon: "X",
    models: [
      { name: "Grok 4.5", description: "Modelo com raciocínio avançado", enabled: false },
      { name: "Grok 4.6", description: "Última versão do Grok", enabled: false },
    ],
  },
  {
    name: "Meta",
    icon: "M",
    models: [
      { name: "Muse Spark 1.3", description: "Modelo open-source da Meta", enabled: true },
      { name: "Muse Spark 1.2", description: "Versão anterior do Muse Spark", enabled: false },
    ],
  },
  {
    name: "DeepSeek",
    icon: "DS",
    models: [
      { name: "V4 Pro", description: "Modelo avançado com raciocínio profundo", enabled: false },
      { name: "V4 Flash", description: "Versão rápida do DeepSeek V4", enabled: false },
    ],
  },
  {
    name: "Alibaba",
    icon: "Al",
    models: [
      { name: "Qwen3.8 Max", description: "Modelo mais inteligente da série Qwen", enabled: false },
      { name: "Qwen3.7 Flash", description: "Modelo rápido para código e raciocínio", enabled: false },
    ],
  },
  {
    name: "Mistral",
    icon: "Mi",
    models: [
      { name: "Mistral Large", description: "Modelo principal da Mistral", enabled: false },
      { name: "Mixtral 8x22B", description: "Modelo mixture-of-experts de alta performance", enabled: false },
    ],
  },
  {
    name: "Nvidia",
    icon: "Nv",
    models: [
      { name: "Nemotron 3.5 Lightning", description: "Modelo ultra-rápido da Nvidia", enabled: true },
      { name: "Nemotron 3 Ultra", description: "Modelo de alta performance da Nvidia", enabled: false },
    ],
  },
];

export function ModelsSettings() {
  const [search, setSearch] = useState("");
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set(modelProviders.map((p) => p.name)));

  const toggleProvider = (name: string) => {
    setExpandedProviders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const filteredProviders = modelProviders
    .map((provider) => ({
      ...provider,
      models: provider.models.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.description.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((provider) => provider.models.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg">Modelos</h2>
        <p className="text-muted-foreground text-xs">
          Modelos carregados de models.dev. Ative os modelos que deseja usar.
        </p>
      </div>

      <Input placeholder="Buscar modelos" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="space-y-4">
        {filteredProviders.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">Nenhum modelo encontrado</p>
        ) : (
          filteredProviders.map((provider) => (
            <div key={provider.name}>
              <button
                type="button"
                className="mb-1 flex w-full items-center gap-2 py-1 text-muted-foreground text-xs uppercase tracking-wide hover:text-foreground"
                onClick={() => toggleProvider(provider.name)}
              >
                <ChevronDown
                  className={cn("size-3 transition-transform", !expandedProviders.has(provider.name) && "-rotate-90")}
                />
                <span className="flex size-5 items-center justify-center rounded-md bg-muted font-medium text-[10px]">
                  {provider.icon}
                </span>
                <span className="font-medium">{provider.name}</span>
                <span className="text-muted-foreground">({provider.models.length})</span>
              </button>
              {expandedProviders.has(provider.name) && (
                <div className="rounded-lg border bg-card">
                  {provider.models.map((model, index) => (
                    <div key={model.name}>
                      {index > 0 && <Separator />}
                      <div className="flex items-center justify-between px-4 py-3">
                        <div>
                          <span className="text-sm">{model.name}</span>
                          <p className="text-muted-foreground text-xs">{model.description}</p>
                        </div>
                        <Switch defaultChecked={model.enabled} />
                      </div>
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
