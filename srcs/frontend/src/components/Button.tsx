import type { ButtonHTMLAttributes } from "react";

type Variant = "normal" | "primary" | "secondary" | "danger" | "info";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
}

const variants: Record<Variant, string> = {
    normal: "bg-surface",
    primary: "bg-primary text-surface",
    secondary: "border-2 border-foreground"
}

function Button({ variant = "normal", type = "button", className = "", ...props }: ButtonProps) {
    return (
        <button
            type={type}
            className={`cursor-pointer rounded-md px-2.5 py-1.5 transition-colors whitespace-nowrap text-center uppercase ${variants[variant]} ${className}`}
            {...props} />
    )
}

export default Button;