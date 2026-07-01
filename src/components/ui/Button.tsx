import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "destructive";

const variantClasses: Record<Variant, string> = {
  // CTA primário — accent laranja, texto preto (README 6.5)
  primary:
    "bg-accent text-slate-950 hover:brightness-110 disabled:brightness-75",
  // CTA secundário — primary verde, texto preto
  secondary:
    "bg-primary text-slate-950 hover:brightness-110 disabled:brightness-75",
  // Ação terciária — pill outline
  tertiary:
    "bg-transparent border border-border text-text-secondary hover:border-text-secondary",
  // Ação destrutiva — texto sem borda
  destructive: "bg-transparent text-error hover:brightness-125",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "secondary",
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDestructive = variant === "destructive";
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isDestructive
          ? "px-4 py-2 text-sm rounded-input"
          : "px-6 py-3.5 rounded-full text-base"
      } ${fullWidth ? "w-full" : ""} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
