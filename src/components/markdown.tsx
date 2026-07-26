interface MarkdownProps {
  content: string;
}

function simpleMarkdownToHtml(md: string): string {
  let html = md;

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Paragraphs - wrap remaining text lines
  const lines = html.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith('<h') &&
      !trimmed.startsWith('<ul') &&
      !trimmed.startsWith('<li') &&
      !trimmed.startsWith('</ul') &&
      !trimmed.startsWith('</li')
    ) {
      result.push(`<p>${trimmed}</p>`);
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

export function Markdown({ content }: MarkdownProps) {
  const html = simpleMarkdownToHtml(content);
  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
