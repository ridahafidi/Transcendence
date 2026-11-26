import type { InputHTMLAttributes } from "react";

interface InputProp extends InputHTMLAttributes<HTMLInputElement> {
    errors?: string[]
}

export function Input({ className = "", errors = [], ...props }: InputProp) {
    const hasError = errors.length > 0;

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
            {hasError &&
                <ol className="list-disc px-10 mt-2">
                    {errors.map((error, id) => (<li key={id} className="text-danger">{error}</li>))}
                </ol>
            }
        </div>
    )
}
