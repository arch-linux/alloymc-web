import { sanitizeMarkdown } from "@/lib/validation";

interface MarkdownRendererProps {
  content: string;
}

function renderMarkdown(md: string): string {
  const safe = sanitizeMarkdown(md);

  return (
    safe
      // Code blocks (fenced)
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="md-pre"><code class="md-code">$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
      // Headings
      .replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
      .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="md-link" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // Images
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="md-img" loading="lazy" />'
      )
      // Unordered lists
      .replace(/^[*-] (.+)$/gm, '<li class="md-li">$1</li>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="md-hr" />')
      // Paragraphs (double newline)
      .replace(/\n\n/g, '</p><p class="md-p">')
      // Line breaks
      .replace(/\n/g, "<br />")
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = renderMarkdown(content);

  return (
    <div
      className="md-content"
      dangerouslySetInnerHTML={{ __html: `<p class="md-p">${html}</p>` }}
    />
  );
}
