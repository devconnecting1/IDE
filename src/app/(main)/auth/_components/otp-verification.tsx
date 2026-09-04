"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEMO_OTP = "25802580";
const OTP_DIGITS = 8;

const inputClasses = cn(
  "size-10 rounded-md border bg-transparent text-center font-mono text-sm tabular-nums transition-colors",
  "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20",
);

export function OtpVerification({
  email,
  onSuccess,
  onBack,
}: {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("auth.form");
  const [otp, setOtp] = useState<string[]>(Array(OTP_DIGITS).fill(""));
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusNext = useCallback((index: number) => {
    if (index < OTP_DIGITS - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const focusPrev = useCallback((index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const digit = value.slice(-1);
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);
      setError(false);
      if (digit) focusNext(index);
    },
    [otp, focusNext],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otp[index]) {
        focusPrev(index);
      }
    },
    [otp, focusPrev],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_DIGITS);
    if (pasted) {
      const newOtp = Array(OTP_DIGITS).fill("");
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      setError(false);
      const nextEmpty = newOtp.findIndex((d) => !d);
      const focusAt = nextEmpty === -1 ? OTP_DIGITS - 1 : nextEmpty;
      inputRefs.current[focusAt]?.focus();
    }
  }, []);

  function handleVerify() {
    const code = otp.join("");
    if (code === DEMO_OTP) {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-center">
        <h3 className="font-medium text-sm">{t("otpTitle")}</h3>
        <p className="text-muted-foreground text-xs">
          {t("otpDescription")} <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className={cn("flex justify-center gap-2", shake && "animate-[shake_0.3s_ease-in-out]")}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <span key={`otp-slot-${i}`} className="contents">
            {i === 4 && <span className="flex items-center text-lg text-muted-foreground">-</span>}
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className={cn(inputClasses, error ? "border-destructive" : "border-input")}
            />
          </span>
        ))}
      </div>

      {error && <p className="text-center text-destructive text-xs">{t("otpInvalid")}</p>}

      <div className="flex flex-col gap-2">
        <Button className="w-full" type="button" onClick={handleVerify}>
          {t("otpVerify")}
        </Button>
        <Button className="w-full" type="button" variant="ghost" size="sm" onClick={onBack}>
          {t("otpBack")}
        </Button>
      </div>

      <p className="text-center text-muted-foreground text-xs">
        {t("otpHint")} <span className="font-medium font-mono text-foreground">2580-2580</span>
      </p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
