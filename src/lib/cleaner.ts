/**
 * Utility to scrub visual editor properties and scripts to export clean, production-ready static HTML.
 */
export const cleanExportHtml = (html: string): string => {
  if (!html) return '';
  let clean = html.replace(/<script id="antigravity-img-fallback">[\s\S]*?<\/script>/gi, '');
  clean = clean.replace(/<script>\s*\(function\(\)\s*\{\s*const\s+initialDarkMode[\s\S]*?<\/script>/gi, '');
  
  // Strip contenteditable and visual editor specific attributes
  clean = clean.replace(/\s*contenteditable="[^"]*"/gi, '');
  clean = clean.replace(/\s*contenteditable/gi, '');
  clean = clean.replace(/\s*data-editable="[^"]*"/gi, '');
  clean = clean.replace(/\s*data-ai-edit="[^"]*"/gi, '');
  clean = clean.replace(/\s*data-editor="[^"]*"/gi, '');
  clean = clean.replace(/\s*data-cms="[^"]*"/gi, '');
  clean = clean.replace(/\s*data-builder="[^"]*"/gi, '');
  clean = clean.replace(/\s*data-component-id="[^"]*"/gi, '');
  clean = clean.replace(/\s*data-node-id="[^"]*"/gi, '');
  clean = clean.replace(/\s*data-antigravity-img-idx="[^"]*"/gi, '');
  
  return clean.trim();
};
