import type { InputHTMLAttributes } from "react";

interface InputProp extends InputHTMLAttributes<HTMLInputElement> {
    error?: string
}

function Input({ className = "", error = "", ...props }: InputProp) {
    const hasError = Boolean(error)

    console.log(hasError, error)
    return (
        <div className="relative">
            <input
                className={[
                    'w-full rounded-md border bg-foreground/5 p-3 text-md text-foreground font-light',
                    'placeholder:text-page/70',
                    className,
                    hasError ?
                        'border-danger focus:border-danger focus:ring-danger/25'
                        : 'border-foreground/25 focus:border-primary focus:ring-primary/25',
                ].join(' ')}
                {...props}
            />
            {hasError && <p className="text-danger">error</p>}
        </div>
    )
}

export default Input;