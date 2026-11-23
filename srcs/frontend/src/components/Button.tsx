import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

const variants: Record<Variant, string> = {
    primary: "bg-primary text-surface",
    secondary: "bg-background/50 border border-foreground/60 "
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variants;
}

function Button({ variant, type = "button", className = "", ...props }: ButtonProps) {
    return (
        <button
            type={type}
            className={
                [
                    "cursor-pointer rounded-md px-2.5 py-1.5 transition-colors whitespace-nowrap text-center uppercase",
                    variant && variants[variant],
                    className,
                ].join(' ')}
            {...props}
        />
    )
}

export default Button;