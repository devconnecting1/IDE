"use client";

import { type ChangeEvent, useRef, useState } from "react";

import { LogOut, type LucideIcon, MonitorSmartphone, Smartphone, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { rootUser } from "@/data/users";
import { cn, getInitials } from "@/lib/utils";

interface Device {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly lastActive: string;
  readonly icon: LucideIcon;
  readonly current: boolean;
}

const devices: readonly Device[] = [
  {
    id: "chrome",
    name: "Chrome on Windows",
    location: "São Paulo, Brazil",
    lastActive: "2 minutes ago",
    icon: MonitorSmartphone,
    current: true,
  },
  {
    id: "iphone",
    name: "Safari on iPhone",
    location: "Rio de Janeiro, Brazil",
    lastActive: "Yesterday",
    icon: Smartphone,
    current: false,
  },
];

export function ProfileSettings() {
  const t = useTranslations("account");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState(rootUser.name.split(" ")[0]);
  const [lastName, setLastName] = useState(rootUser.name.split(" ").slice(1).join(" "));
  const [email, setEmail] = useState(rootUser.email);
  const [avatar, setAvatar] = useState(rootUser.avatar);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  function handlePictureChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Profile Picture */}
      <Card>
        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("profilePicture")}</FieldLabel>
              <FieldDescription>{t("profilePictureDescription")}</FieldDescription>
            </FieldContent>
            <div className="flex items-center gap-2">
              <Avatar className="size-12 rounded-full">
                <AvatarImage src={avatar || undefined} alt={t("profilePicture")} />
                <AvatarFallback className="rounded-full text-sm">{getInitials(rootUser.name)}</AvatarFallback>
              </Avatar>
              <Button type="button" onClick={() => fileInputRef.current?.click()} size="sm" variant="outline">
                <Upload aria-hidden="true" />
                {t("uploadPicture")}
              </Button>
              <Button
                type="button"
                onClick={() => setAvatar("")}
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
              >
                {t("removePicture")}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
                onChange={handlePictureChange}
              />
            </div>
          </Field>
        </CardContent>
      </Card>

      {/* Name */}
      <Card>
        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("name")}</FieldLabel>
              <FieldDescription>{t("nameDescription")}</FieldDescription>
            </FieldContent>
            <div className="flex items-center gap-2">
              <Input
                id="profile-first-name"
                value={firstName}
                onChange={(event) => {
                  setIsDirty(true);
                  setFirstName(event.target.value);
                }}
                placeholder={t("firstName")}
                className="w-40"
              />
              <Input
                id="profile-last-name"
                value={lastName}
                onChange={(event) => {
                  setIsDirty(true);
                  setLastName(event.target.value);
                }}
                placeholder={t("lastName")}
                className="w-40"
              />
            </div>
          </Field>
        </CardContent>
        <CardFooter className="justify-end">
          <Button size="sm" disabled={!isDirty}>
            {t("save")}
          </Button>
        </CardFooter>
      </Card>

      {/* Email */}
      <Card>
        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("email")}</FieldLabel>
              <FieldDescription>{t("emailDescription")}</FieldDescription>
            </FieldContent>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => {
                setIsDirty(true);
                setEmail(event.target.value);
              }}
              className="w-72"
            />
          </Field>
        </CardContent>
        <CardFooter className="justify-end">
          <Button size="sm" disabled={!isDirty}>
            {t("save")}
          </Button>
        </CardFooter>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("twoFactor")}</FieldLabel>
              <FieldDescription>{t("twoFactorDescription")}</FieldDescription>
            </FieldContent>
            <div className="flex items-center gap-2">
              <Badge className={cn(twoFactorEnabled && "border-green-600 text-green-600")} variant="outline">
                {twoFactorEnabled ? t("twoFactorEnabled") : t("twoFactorDisabled")}
              </Badge>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
                aria-label={t("twoFactor")}
              />
            </div>
          </Field>
        </CardContent>
      </Card>

      {/* Set Password */}
      <Card>
        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>{t("setPassword")}</FieldLabel>
              <FieldDescription>{t("setPasswordDescription")}</FieldDescription>
            </FieldContent>
            <div className="flex items-center gap-2">
              <Input
                id="profile-new-password"
                type="password"
                autoComplete="new-password"
                placeholder={t("newPassword")}
                className="w-48"
                value={newPassword}
                onChange={(event) => {
                  setIsDirty(true);
                  setNewPassword(event.target.value);
                }}
              />
              <Input
                id="profile-confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder={t("confirmPassword")}
                className="w-48"
                value={confirmPassword}
                onChange={(event) => {
                  setIsDirty(true);
                  setConfirmPassword(event.target.value);
                }}
              />
            </div>
          </Field>
        </CardContent>
        <CardFooter className="justify-end">
          <Button size="sm" disabled={!isDirty}>
            {t("save")}
          </Button>
        </CardFooter>
      </Card>

      {/* Devices */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-base">{t("devices")}</h3>
          <p className="mt-1 text-muted-foreground text-sm">{t("devicesDescription")}</p>
        </CardContent>
        <CardContent>
          <div className="flex flex-col gap-2">
            {devices.map((device) => {
              const Icon = device.icon;
              return (
                <div key={device.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">{device.name}</p>
                      <p className="truncate text-muted-foreground text-xs">
                        {device.location} · {device.lastActive}
                      </p>
                    </div>
                  </div>
                  {device.current ? (
                    <Badge className="border-green-600 text-green-600" variant="outline">
                      {t("activeNow")}
                    </Badge>
                  ) : (
                    <Button size="icon-sm" variant="ghost" aria-label={t("signOut")}>
                      <LogOut aria-hidden="true" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="ring-destructive/20">
        <CardContent>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel className="text-destructive">{t("dangerZone")}</FieldLabel>
              <FieldDescription>{t("dangerZoneDescription")}</FieldDescription>
            </FieldContent>
            <Button variant="destructive" size="sm" className="text-destructive-foreground">
              <Trash2 aria-hidden="true" />
              {t("deleteAccount")}
            </Button>
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
