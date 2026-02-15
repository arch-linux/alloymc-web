import { cn } from "@/lib/cn";

type BadgeProps = {
  variant?: "default" | "ember" | "gold";
  children: React.ReactNode;
  className?: string;
};

const variants = {
  default: "bg-obsidian-700 text-stone-300 border-obsidian-600",
  ember: "bg-ember/15 text-ember border-ember/30",
  gold: "bg-forge-gold/15 text-forge-gold border-forge-gold/30",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
