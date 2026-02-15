import Link from "next/link";
import { AlloyLogo, DiscordIcon, GitHubIcon } from "@/components/icons";
import { SITE } from "@/lib/constants";

const footerLinks = {
  Project: [
    { label: "About", href: "/about" },
    { label: "Downloads", href: "/downloads" },
    { label: "Getting Started", href: "/getting-started" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Community", href: "/community" },
    { label: "GitHub", href: SITE.github, external: true },
  ],
  Community: [
    { label: "Discord", href: SITE.discord, external: true },
    { label: "Contributing", href: "/community#contributing" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-obsidian-700/50 bg-obsidian-900">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 font-heading text-lg font-bold text-stone-100 mb-4">
              <AlloyLogo className="w-7 h-7" />
              {SITE.name}
            </Link>
            <p className="text-sm text-stone-400 mb-4">{SITE.tagline}</p>
            <div className="flex gap-3">
              <a
                href={SITE.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-400 hover:text-ember transition-colors"
                aria-label="Discord"
              >
                <DiscordIcon />
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-400 hover:text-ember transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading font-semibold text-stone-200 mb-4 text-sm uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-stone-400 hover:text-ember transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-stone-400 hover:text-ember transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-obsidian-700/50 text-center text-sm text-stone-400">
          <p>&copy; {new Date().getFullYear()} Alloy. Built by the community, for the community.</p>
        </div>
      </div>
    </footer>
  );
}
