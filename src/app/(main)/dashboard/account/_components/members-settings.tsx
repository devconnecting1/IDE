"use client";

import { useState } from "react";

import { Mail, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { users } from "@/data/users";
import { getInitials } from "@/lib/utils";

interface PendingInvite {
  readonly id: string;
  readonly email: string;
  readonly role: "admin" | "member";
}

const initialInvites: readonly PendingInvite[] = [
  { id: "1", email: "maria@empresa.com", role: "member" },
  { id: "2", email: "joao@empresa.com", role: "admin" },
];

const initialDomains = ["empresa.com"];

export function MembersSettings() {
  const t = useTranslations("account");
  const [invites, setInvites] = useState<PendingInvite[]>([...initialInvites]);
  const [domains, setDomains] = useState<string[]>([...initialDomains]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [domainInput, setDomainInput] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  function handleAddInvite() {
    if (!inviteEmail.trim()) {
      return;
    }
    setIsDirty(true);
    setInvites((current) => [...current, { id: crypto.randomUUID(), email: inviteEmail.trim(), role: inviteRole }]);
    setInviteEmail("");
  }

  function handleAddDomain() {
    const value = domainInput
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "");
    if (!value) {
      return;
    }
    setIsDirty(true);
    setDomains((current) => (current.includes(value) ? current : [...current, value]));
    setDomainInput("");
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <Tabs defaultValue="team">
        <TabsList variant="line">
          <TabsTrigger value="team">{t("team")}</TabsTrigger>
          <TabsTrigger value="invites">{t("invites")}</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="mt-4">
          <Card>
            <CardContent>
              <h3 className="font-medium text-base">{t("team")}</h3>
              <p className="mt-1 text-muted-foreground text-sm">{t("teamDescription")}</p>
            </CardContent>
            {users.map((user) => (
              <CardContent key={user.id}>
                <Field orientation="responsive">
                  <FieldContent>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 rounded-lg">
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <FieldLabel>{user.name}</FieldLabel>
                        <FieldDescription>{user.email}</FieldDescription>
                      </div>
                    </div>
                  </FieldContent>
                  <div className="flex items-center gap-2">
                    <Badge className="border-green-600 text-green-600" variant="outline">
                      {t("active")}
                    </Badge>
                    <Select defaultValue={user.role === "administrator" ? "admin" : "member"}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">{t("roleAdmin")}</SelectItem>
                        <SelectItem value="member">{t("roleMember")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon-sm" variant="ghost" aria-label={t("removeMember")}>
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                </Field>
              </CardContent>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="invites" className="mt-4">
          {/* Invite Form */}
          <Card>
            <CardContent>
              <h3 className="font-medium text-base">{t("inviteTitle")}</h3>
              <p className="mt-1 text-muted-foreground text-sm">{t("inviteDescription")}</p>
            </CardContent>
            <CardContent>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel>{t("email")}</FieldLabel>
                  <FieldDescription>{t("inviteLinkHint")}</FieldDescription>
                </FieldContent>
                <div className="flex items-center gap-2">
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder={t("invitePlaceholder")}
                    className="w-56"
                  />
                  <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as "admin" | "member")}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t("roleAdmin")}</SelectItem>
                      <SelectItem value="member">{t("roleMember")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleAddInvite}>
                    <Plus aria-hidden="true" />
                    {t("sendInvite")}
                  </Button>
                </div>
              </Field>
            </CardContent>
          </Card>

          {/* Pending Invites */}
          <Card className="mt-6">
            <CardContent>
              <h3 className="font-medium text-base">{t("pendingInvites")}</h3>
              <p className="mt-1 text-muted-foreground text-sm">{t("pendingInvitesDescription")}</p>
            </CardContent>
            {invites.length === 0 ? (
              <CardContent>
                <p className="text-muted-foreground text-sm">{t("noPendingInvites")}</p>
              </CardContent>
            ) : (
              invites.map((invite) => (
                <CardContent key={invite.id}>
                  <Field orientation="responsive">
                    <FieldContent>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Mail aria-hidden="true" className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <FieldLabel>{invite.email}</FieldLabel>
                          <FieldDescription>
                            {t(invite.role === "admin" ? "roleAdmin" : "roleMember")}
                          </FieldDescription>
                        </div>
                      </div>
                    </FieldContent>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <RefreshCw aria-hidden="true" />
                        {t("resend")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsDirty(true);
                          setInvites((current) => current.filter((i) => i.id !== invite.id));
                        }}
                      >
                        {t("cancelInvite")}
                      </Button>
                    </div>
                  </Field>
                </CardContent>
              ))
            )}
          </Card>

          {/* Approved Domains */}
          <Card className="mt-6">
            <CardContent>
              <h3 className="font-medium text-base">{t("approvedDomains")}</h3>
              <p className="mt-1 text-muted-foreground text-sm">{t("approvedDomainsDescription")}</p>
            </CardContent>
            <CardContent>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel>{t("approvedDomains")}</FieldLabel>
                </FieldContent>
                <div className="flex items-center gap-2">
                  <Input
                    id="domain-input"
                    value={domainInput}
                    onChange={(event) => setDomainInput(event.target.value)}
                    placeholder={t("domainPlaceholder")}
                    className="w-56 font-mono"
                  />
                  <Button size="sm" onClick={handleAddDomain}>
                    <Plus aria-hidden="true" />
                    {t("addDomain")}
                  </Button>
                </div>
              </Field>
            </CardContent>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {domains.map((domain) => (
                  <Badge key={domain} variant="outline" className="gap-1.5 py-1 font-mono">
                    {domain}
                    <button
                      type="button"
                      aria-label={`${t("removeDomain")} ${domain}`}
                      onClick={() => {
                        setIsDirty(true);
                        setDomains((current) => current.filter((d) => d !== domain));
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 aria-hidden="true" className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
