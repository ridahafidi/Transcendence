import type { ButtonHTMLAttributes } from "react";

type Variant = "normal" | "primary" | "danger" | "info" | "tab";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
}

const variants: Record<Variant, string> = {
    normal: "text-muted hover:text-foreground",
    primary: "bg-primary text-background font-semibold hover:brightness-110",
    danger: "bg-danger text-foreground font-medium hover:opacity-90",
    info: "border border-info/20 bg-info/10 text-foreground font-medium hover:bg-info/20",
    tab: "text-muted font-semibold hover:text-foreground aria-selected:bg-white/10 aria-selected:text-foreground",

}

function Button({ variant = "normal", type = "button", className = "", ...props }: ButtonProps) {
    return (
        <button
            type={type}
            className={`rounded-md px-5 py-2.5 text-sm transition-colors ${variants[variant]} ${className}`}
            {...props} />
    )
}

export default Button;