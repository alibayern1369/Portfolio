interface MarkdownProps {
  content: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInline(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return s;
}

function safeImageSrc(src: string): string {
  const trimmed = src.trim();
  // Allow only http(s) or same-origin relative paths
  if (/^https?:\/\//i.test(trimmed) || (trimmed.startsWith("/") && !trimmed.startsWith("//"))) {
    return escapeHtml(trimmed);
  }
  return "#";
}

function simpleMarkdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const result: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      result.push("</ul>");
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }

    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
    if (imgMatch) {
      closeList();
      const safeAlt = escapeHtml(imgMatch[1] || "تصویر پروژه");
      const safeSrc = safeImageSrc(imgMatch[2]);
      result.push(
        `<figure class="prose-image"><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" decoding="async" sizes="(max-width: 768px) 100vw, 768px" style="width:100%;height:auto;object-fit:cover;object-position:center" /><figcaption>${safeAlt}</figcaption></figure>`
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      result.push(`<h3>${formatInline(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      closeList();
      result.push(`<h2>${formatInline(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      closeList();
      result.push(`<h1>${formatInline(trimmed.slice(2))}</h1>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        result.push("<ul>");
        inList = true;
      }
      result.push(`<li>${formatInline(trimmed.slice(2))}</li>`);
      continue;
    }

    closeList();
    result.push(`<p>${formatInline(trimmed)}</p>`);
  }

  closeList();
  return result.join("\n");
}

export function Markdown({ content }: MarkdownProps) {
  const html = simpleMarkdownToHtml(content || "");
  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
