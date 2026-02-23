import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Examples",
  description: "Interactive example mods and code snippets to learn Alloy modding.",
};

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
