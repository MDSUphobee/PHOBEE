import React from 'react';
import { cn } from '@/lib/utils';

export const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground/80 mb-2 block", className)} {...props}>
    {children}
  </label>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200",
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
      "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

export const Checkbox = ({ label, checked, onChange, className }: { label: string, checked: boolean, onChange: (checked: boolean) => void, className?: string }) => (
  <div className={cn("flex items-center space-x-2", className)}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
    />
    <label className="text-sm font-medium leading-none text-foreground/80 cursor-pointer">{label}</label>
  </div>
);

export const RadioGroup = ({ value, onChange, options, name }: { value: string, onChange: (val: any) => void, options: { label: string, value: string }[], name: string }) => (
  <div className="flex flex-wrap gap-4 mt-2">
    {options.map((opt) => (
      <label key={opt.value} className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200",
        value === opt.value ? "bg-primary/10 border-primary text-primary" : "bg-background border-border hover:border-primary/50"
      )}>
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
          className="h-4 w-4 text-primary focus:ring-primary hidden"
        />
        <span className="text-sm font-medium">{opt.label}</span>
      </label>
    ))}
  </div>
);

export const SectionTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h3 className={cn("text-lg font-semibold text-primary/80 mb-6 border-l-4 border-primary/40 pl-4", className)}>
    {children}
  </h3>
);
