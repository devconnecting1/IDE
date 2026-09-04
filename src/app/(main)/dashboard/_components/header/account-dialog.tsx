"use client";

import { useState } from "react";

import { Cpu, Keyboard, Server, Settings2, Sparkles } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[480px] gap-0 overflow-hidden p-0 sm:max-w-[640px] md:max-w-[800px] lg:max-w-[960px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>
        <div className="flex overflow-hidden">
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
    <div>
      <h2 className="mb-4 font-semibold text-lg">Geral</h2>
      <div className="rounded-lg border">
        <div className="px-4">
          <SettingRow title="Idioma" description="Alterar o idioma de exibição do Studio">
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
          <SettingRow title="Shell do terminal" description="Escolha o shell usado no terminal">
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
            description="Mostrar partes das ferramentas de edição, escrita e patch expandidas por padrão"
          >
            <Switch defaultChecked />
          </SettingRow>
        </div>
      </div>
    </div>
  );
}

function ShortcutsSettings() {
  return (
    <div>
      <h2 className="mb-4 font-semibold text-lg">Atalhos</h2>
      <div className="rounded-lg border p-4 text-muted-foreground text-sm">
        Configuração de atalhos de teclado em breve.
      </div>
    </div>
  );
}

function ServersSettings() {
  return (
    <div>
      <h2 className="mb-4 font-semibold text-lg">Servidores</h2>
      <div className="rounded-lg border p-4 text-muted-foreground text-sm">Configuração de servidores em breve.</div>
    </div>
  );
}

function ProvidersSettings() {
  return (
    <div>
      <h2 className="mb-4 font-semibold text-lg">Provedores</h2>
      <div className="rounded-lg border p-4 text-muted-foreground text-sm">Configuração de provedores em breve.</div>
    </div>
  );
}

function ModelsSettings() {
  return (
    <div>
      <h2 className="mb-4 font-semibold text-lg">Modelos</h2>
      <div className="rounded-lg border p-4 text-muted-foreground text-sm">Configuração de modelos em breve.</div>
    </div>
  );
}
