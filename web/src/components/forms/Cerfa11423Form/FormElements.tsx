import React from 'react';
import { cn } from '@/lib/utils';

export const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("text-sm font-semibold text-foreground/80 mb-1.5 block ml-0.5", className)} {...props}>
    {children}
  </label>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border border-input bg-slate-100 dark:bg-slate-800/50 px-4 py-2 text-base ring-offset-background transition-all duration-200",
        "text-foreground placeholder:text-slate-900 dark:placeholder:text-slate-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:border-primary focus-visible:bg-card",
        "hover:border-primary/30",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Select = ({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      "flex h-12 w-full rounded-xl border border-input bg-slate-100 dark:bg-slate-800/50 px-4 py-2 text-base ring-offset-background transition-all duration-200 text-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:border-primary focus-visible:bg-slate-800",
      "hover:border-primary/30 cursor-pointer",
      "md:text-sm appearance-none",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

export const Checkbox = ({ label, checked, onChange, className }: { label: string, checked: boolean, onChange: (checked: boolean) => void, className?: string }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={cn(
      "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none",
      checked 
        ? "bg-primary/5 border-primary shadow-sm" 
        : "bg-slate-100 dark:bg-slate-800/30 border-transparent hover:border-primary/20 hover:bg-card",
      className
    )}
  >
    <div className={cn(
      "h-5 w-5 rounded border-2 flex items-center justify-center transition-all",
      checked ? "bg-primary border-primary" : "bg-transparent border-muted-foreground/30"
    )}>
      {checked && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-primary-foreground">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
    <span className={cn("text-sm font-bold transition-colors", checked ? "text-primary font-bold" : "text-foreground/90")}>
      {label}
    </span>
  </div>
);

export const RadioGroup = ({ value, onChange, options, name }: { value: string, onChange: (val: any) => void, options: { label: string, value: string }[], name: string }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
    {options.map((opt) => (
      <label key={opt.value} className={cn(
        "flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
        value === opt.value 
          ? "bg-primary/5 border-primary shadow-sm" 
          : "bg-slate-100 dark:bg-slate-800/30 border-input hover:border-primary/20 hover:bg-card"
      )}>
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
          className="h-4 w-4 text-primary focus:ring-primary hidden"
        />
        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
          value === opt.value ? "border-primary" : "border-muted-foreground/30"
        )}>
          {value === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
        <span className={cn("text-sm font-bold transition-colors", value === opt.value ? "text-primary" : "text-foreground/90")}>
          {opt.label}
        </span>
      </label>
    ))}
  </div>
);

export const SectionTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("flex items-center gap-3 mb-8", className)}>
    <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
    <h3 className="text-xl font-bold text-foreground">
      {children}
    </h3>
  </div>
);

export const FormGrid = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6", className)}>
    {children}
  </div>
);

export const StepContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out space-y-12 pb-6">
    {children}
  </div>
);

export const FormSection = ({ title, children, className }: { title?: string, children: React.ReactNode, className?: string }) => (
  <div className={cn("space-y-6", className)}>
    {title && <SectionTitle>{title}</SectionTitle>}
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 border border-border/50 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  </div>
);
