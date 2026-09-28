import { FadeIn } from "./FadeIn";

type PageHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, lead, children }: PageHeaderProps) {
  return (
    <FadeIn immediate className="max-w-4xl mb-16 md:mb-24">
      {eyebrow && <p className="font-sans text-xs tracking-widest uppercase text-accent mb-6">{eyebrow}</p>}
      <h1 className="font-serif text-[clamp(2.75rem,6vw,5rem)] leading-[1.05] tracking-tight mb-8">{title}</h1>
      {lead && (
        <p className="font-sans text-lg md:text-2xl leading-relaxed opacity-80 border-l-2 border-accent pl-6 py-2">{lead}</p>
      )}
      {children}
    </FadeIn>
  );
}
