import type { InputHTMLAttributes } from "react";

function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`rounded-md border-1 border-foreground/25 bg-foreground/5 p-3 text-md text-foreground font-light placeholder:text-page/70 focus:border-primary focus:outline-none ${className}`}
            {...props}
        />)
}

export default Input;