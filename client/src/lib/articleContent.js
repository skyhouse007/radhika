/**
 * Turns article markup into safe-ish HTML for display.
 *
 * Tags you can use in content:
 *   <h1>…</h1> <h2>…</h2> <h3>…</h3> <p>…</p>
 *   <img1> <img2> …  → replaced with uploaded images
 *   <link href="https://…">Label</link>
 *   <link>https://…</link>
 */
export function renderArticleHtml(content, contentImages = {}, resolveUrl = (u) => u) {
  let html = String(content || '');

  const images =
    contentImages instanceof Map
      ? Object.fromEntries(contentImages)
      : contentImages && typeof contentImages === 'object'
        ? contentImages
        : {};

  html = html.replace(/<img(\d+)\s*\/?>/gi, (_, num) => {
    const key = `img${num}`;
    const src = images[key];
    if (!src) {
      return `<span class="article-img-missing">[Upload image for &lt;img${num}&gt;]</span>`;
    }
    return `<img src="${resolveUrl(src)}" alt="" class="article-inline-img" />`;
  });

  html = html.replace(
    /<link\s+href=["']([^"']+)["']\s*>([\s\S]*?)<\/link>/gi,
    (_m, href, label) =>
      `<a href="${href}" target="_blank" rel="noreferrer" class="article-link">${label || href}</a>`
  );

  html = html.replace(
    /<link>(https?:\/\/[^<]+)<\/link>/gi,
    (_m, href) =>
      `<a href="${href.trim()}" target="_blank" rel="noreferrer" class="article-link">${href.trim()}</a>`
  );

  return html;
}

export function findImgTags(content) {
  const found = new Set();
  const re = /<img(\d+)\s*\/?>/gi;
  let match;
  while ((match = re.exec(content || '')) !== null) {
    found.add(`img${match[1]}`);
  }
  return Array.from(found).sort((a, b) => Number(a.slice(3)) - Number(b.slice(3)));
}

export const FONT_OPTIONS = [
  'Assistant',
  'Libre Baskerville',
  'Cormorant Garamond',
  'Georgia',
  'Times New Roman',
  'Arial',
];
