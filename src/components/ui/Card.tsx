import { cn } from "@/lib/cn";

type CardProps = {
  glow?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Card({ glow, children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-obsidian-600 bg-obsidian-800 p-6 transition-all duration-300",
        glow &&
          "hover:border-ember/50 hover:shadow-lg hover:shadow-ember/10",
        className
      )}
    >
      {children}
    </div>
  );
}
