"use client";

import { Plus } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import React from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

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
                "flex flex-1 items-center justify-between py-6 font-medium transition-all [&[data-state=open]>svg]:rotate-180",
                className
            )}
            {...props}
        >
            {children}
            <Plus className="h-5 w-5 shrink-0 transition-transform duration-200 text-slate-400 group-hover:text-primary" />
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
        <div className={cn("pb-6 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
));
AccordionContentWrapper.displayName = "AccordionContent";


export default function FAQ() {
    const faqs = [
        {
            q: "La plateforme prend-elle en compte ma situation spécifique ?",
            a: "Oui, PhoBee s'adapte à votre type d'exploitation (Cultures, Élevage, Viticulture) et votre forme juridique (EARL, GAEC, etc.). Le radar à aides scanne uniquement ce qui est pertinent pour vous."
        },
        {
            q: "Mes données sont-elles sécurisées ?",
            a: "Absolument. Vos données d'exploitation sont chiffrées. Nous savons à quel point le secret professionnel et la confidentialité sont importants dans le monde agricole."
        },
        {
            q: "Les documents sont-ils conformes ?",
            a: "Tous nos modèles de CERFA et contrats sont mis à jour régulièrement par des experts en droit rural pour garantir leur conformité totale."
        },
        {
            q: "Quel est le coût pour mon exploitation ?",
            a: "Nous fonctionnons au résultat : vous ne payez un pourcentage que sur les subventions effectivement perçues. Pour les CERFA, le tarif est fixe selon la complexité."
        }
    ];

    return (
        <section className="py-32 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Questions Fréquentes</h2>
                    <div className="h-1 w-20 bg-[#FFD700] mx-auto rounded-full" />
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 mb-12">
                    <AccordionRoot type="single" collapsible className="w-full">
                        {faqs.map((faq, i) => (
                            <AccordionItemWrapper key={i} value={`item-${i}`} className="border-slate-100 dark:border-slate-800 group">
                                <AccordionTriggerWrapper className="text-left text-lg font-bold text-slate-800 dark:text-white hover:text-[#FFD700] transition-colors">
                                    {faq.q}
                                </AccordionTriggerWrapper>
                                <AccordionContentWrapper className="text-slate-500 dark:text-white text-base leading-relaxed">
                                    {faq.a}
                                </AccordionContentWrapper>
                            </AccordionItemWrapper>
                        ))}
                    </AccordionRoot>
                </div>

                <div className="text-center">
                    <Link href="/faq">
                        <Button className="rounded-full px-8 py-6 text-lg bg-[#FFD700] text-slate-900 font-bold hover:bg-[#FFC000] shadow-lg hover:shadow-xl transition-all">
                            Consulter toute la FAQ
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
