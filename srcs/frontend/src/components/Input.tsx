import type { InputHTMLAttributes } from "react";

function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full rounded-md border border-info/20 bg-info/10 px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none ${className}`}
            {...props}
        />)
}

export default Input;