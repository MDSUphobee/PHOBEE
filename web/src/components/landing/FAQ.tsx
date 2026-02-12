"use client";

// Imports removed
import { Plus } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import React from "react";

// Inline simple Accordion Component because I didn't run the shadcn init command fully
const AccordionRoot = AccordionPrimitive.Root;

const AccordionItemWrapper = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn("border-b", className)}
        {...props}
    />
));
AccordionItemWrapper.displayName = "AccordionItem";

const AccordionTriggerWrapper = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className
            )}
            {...props}
        >
            {children}
            <Plus className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
));
AccordionTriggerWrapper.displayName = "AccordionTrigger";

const AccordionContentWrapper = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
    >
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
));
AccordionContentWrapper.displayName = "AccordionContent";


export default function FAQ() {
    const faqs = [
        {
            q: "Est-ce vraiment gratuit ?",
            a: "Nous avons une offre Freemium qui permet de suivre 2 échéances par mois. L'offre illimitée avec Radar à Aides est à 9€/mois."
        },
        {
            q: "Mes données sont-elles partagées ?",
            a: "Jamais. Vos données sont chiffrées sur votre téléphone. Nous n'avons pas accès à vos comptes bancaires, uniquement en lecture seule via l'API sécurisée si vous la connectez."
        },
        {
            q: "Ça marche pour les artisans ?",
            a: "Absolument. Phobee est optimisé pour tous les micro-entrepreneurs : artisans, libéraux, commerçants."
        },
        {
            q: "Puis-je résilier quand je veux ?",
            a: "Oui, en un clic depuis l'application. Pas de lettre recommandée, pas de frais cachés."
        }
    ];

    return (
        <section className="py-32 bg-background text-foreground">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold text-foreground">Questions Fréquentes</h2>
                </div>

                <AccordionRoot type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItemWrapper key={i} value={`item-${i}`} className="border-b border-slate-100 dark:border-slate-800">
                            <AccordionTriggerWrapper className="text-left text-lg font-medium text-foreground py-6 hover:no-underline hover:text-primary transition-colors">
                                {faq.q}
                            </AccordionTriggerWrapper>
                            <AccordionContentWrapper className="text-muted-foreground text-base leading-relaxed pb-6">
                                {faq.a}
                            </AccordionContentWrapper>
                        </AccordionItemWrapper>
                    ))}
                </AccordionRoot>
            </div>
        </section>
    );
}
