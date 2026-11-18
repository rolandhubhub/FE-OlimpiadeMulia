"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  autoComplete: "current-password" | "new-password";
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  autoComplete,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      id={id}
      label={label}
      type={visible ? "text" : "password"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      error={error}
      hint={hint}
      placeholder={placeholder}
      autoComplete={autoComplete}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          title={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          className="flex h-10 w-10 items-center justify-center text-teks-sekunder transition-colors hover:text-plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jingga"
        >
          {visible ? (
            <EyeOff size={18} aria-hidden="true" />
          ) : (
            <Eye size={18} aria-hidden="true" />
          )}
        </button>
      }
    />
  );
}
