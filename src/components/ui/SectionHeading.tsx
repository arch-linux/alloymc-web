import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn("text-center mb-12", className)}>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-100 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-stone-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
