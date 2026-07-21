/**
 * Utility to convert clean generated HTML with Tailwind classes to React JSX format
 */
export function convertHtmlToReact(html: string): string {
  if (!html) return '';

  let jsx = html.trim();

  // Strip contenteditable and visual editor specific attributes
  jsx = jsx.replace(/\s*contenteditable="[^"]*"/gi, '');
  jsx = jsx.replace(/\s*contenteditable/gi, '');
  jsx = jsx.replace(/\s*data-editable="[^"]*"/gi, '');
  jsx = jsx.replace(/\s*data-ai-edit="[^"]*"/gi, '');
  jsx = jsx.replace(/\s*data-editor="[^"]*"/gi, '');
  jsx = jsx.replace(/\s*data-cms="[^"]*"/gi, '');
  jsx = jsx.replace(/\s*data-builder="[^"]*"/gi, '');
  jsx = jsx.replace(/\s*data-component-id="[^"]*"/gi, '');
  jsx = jsx.replace(/\s*data-node-id="[^"]*"/gi, '');
  jsx = jsx.replace(/\s*data-antigravity-img-idx="[^"]*"/gi, '');

  // 1. Strip doctype, html, head, body wrappers to return clean component layout
  const bodyMatch = jsx.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    jsx = bodyMatch[1].trim();
  } else {
    jsx = jsx.replace(/<!DOCTYPE html>/gi, '')
             .replace(/<\/?html[^>]*>/gi, '')
             .replace(/<head>[\s\S]*?<\/head>/gi, '')
             .replace(/<\/?body[^>]*>/gi, '');
  }

  // 2. Convert class to className
  jsx = jsx.replace(/\sclass=/g, ' className=');

  // 3. Fix self-closing elements: <img ...>, <input ...>, <br>, <hr>
  jsx = jsx.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/gi, '<$1$2 />');

  // 4. Convert style attributes to React JSX style objects
  jsx = jsx.replace(/style="([^"]*)"/gi, (match, styleStr: string) => {
    const rules = styleStr.split(';').map(r => r.trim()).filter(Boolean);
    const reactStyleRules = rules.map(rule => {
      const parts = rule.split(':');
      if (parts.length < 2) return '';
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();

      // Convert css property to camelCase (e.g. padding-top -> paddingTop)
      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

      // If value is numeric, keep it raw, else wrap in single quotes
      let formattedVal = val;
      if (!isNaN(Number(val)) && val !== '') {
        formattedVal = val;
      } else {
        formattedVal = `'${val.replace(/'/g, "\\'")}'`;
      }
      return `${camelKey}: ${formattedVal}`;
    }).filter(Boolean);

    return `style={{ ${reactStyleRules.join(', ')} }}`;
  });

  // 5. Convert generic onclick/onsubmit attributes to camelCase onClick/onSubmit
  jsx = jsx.replace(/onclick=/gi, 'onClick=');
  jsx = jsx.replace(/onsubmit=/gi, 'onSubmit=');
  jsx = jsx.replace(/onchange=/gi, 'onChange=');

  // 6. Wrap in standard export component template
  return `import React from 'react';

export default function GeneratedPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      ${jsx.split('\n').map(line => '      ' + line).join('\n')}
    </div>
  );
}
`;
}
