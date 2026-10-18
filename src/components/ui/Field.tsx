import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/**
 * Accessible form controls. Each control gets a visible <label>, optional hint,
 * and an error message wired up with aria-describedby / aria-invalid.
 * Error text is shown with an icon-free "Error:" prefix so it is not conveyed by colour alone.
 */

const controlBase =
  "block w-full min-h-12 rounded-control border bg-white px-3.5 py-3 text-base text-ink placeholder:text-muted focus-visible:outline-offset-0";

function controlClass(hasError: boolean) {
  return `${controlBase} ${hasError ? "border-danger" : "border-[#9ca3af]"}`;
}

type ShellProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | undefined;
  children: ReactNode;
};

function FieldShell({ id, label, required, hint, error, children }: ShellProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-muted">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger">
          <span className="font-semibold">Error: </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

type BaseProps = { id: string; label: string; hint?: string; error?: string | undefined };

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  ...input
}: BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">) {
  return (
    <FieldShell id={id} label={label} required={!!required} {...(hint ? { hint } : {})} error={error}>
      <input
        id={id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClass(!!error)}
        {...input}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  required,
  children,
  ...select
}: BaseProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className">) {
  return (
    <FieldShell id={id} label={label} required={!!required} {...(hint ? { hint } : {})} error={error}>
      <select
        id={id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClass(!!error)}
        {...select}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  required,
  ...area
}: BaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">) {
  return (
    <FieldShell id={id} label={label} required={!!required} {...(hint ? { hint } : {})} error={error}>
      <textarea
        id={id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${controlClass(!!error)} min-h-28 resize-y`}
        {...area}
      />
    </FieldShell>
  );
}
